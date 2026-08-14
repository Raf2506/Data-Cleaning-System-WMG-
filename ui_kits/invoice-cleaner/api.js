// Adapter between the Flask API and the shape the screens render.
//
// The screens were written against the sample dataset in data.js, which uses
// camelCase keys. The API returns the pandas column names (snake_case at the
// envelope level, Title Case inside record lists). Everything that crosses that
// boundary is translated here, so no screen has to know both vocabularies.
//
// window.INVOICE stays the single source the screens read. On boot we replace
// its contents with live data; if the API is unreachable — opening index.html
// straight off the filesystem, or the server not running — the sample data
// stays in place and API.live is false.

(function () {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const n = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
  const s = (v) => (v == null ? "" : String(v));

  // The blank slate the app shows on a fresh load, before any file is uploaded.
  function emptyDataset() {
    window.INVOICE = {
      file: null,
      stats: { totalSales: 0, period: "", invoices: 0, lineItems: 0, outlets: 0, stores: 0, products: 0, unmappedRows: 0, unmappedNames: [], bestOutlet: null, bestStore: null, bestProduct: null, bestMonth: null, bestOutletByMonth: [] },
      byOutlet: [], byStore: [], contribution: [], monthly: [], brandPie: [], bestProductByOutlet: [],
      rows: [], groups: [], outlets: [], months: [], total: 0,
      stores: [], codes: [],
      parse: { invoices: 0, lineItems: 0, dateFrom: "", dateTo: "", rawNames: 0, continuationRows: 0, discardedRows: 0 },
      productsByOutlet: {},
    };
  }

  /** "2026-01" -> "Jan 2026". Anything unparseable passes through unchanged. */
  function monthLabel(month) {
    const m = /^(\d{4})-(\d{2})$/.exec(s(month));
    return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : s(month);
  }

  /** summary_stats returns period as a (min, max) tuple of "YYYY-MM" strings. */
  function periodLabel(period) {
    if (!Array.isArray(period) || period.length !== 2) return "";
    const [from, to] = period.map(monthLabel);
    return from === to ? from : `${from} – ${to}`;
  }

  async function get(path) {
    const res = await fetch(path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`${path} → ${res.status}`);
    return res.json();
  }

  /**
   * Pull a readable message out of a failed response. The API sends
   * {error, message}; anything else (a proxy page, a debug traceback) would
   * otherwise be rendered verbatim as markup.
   */
  async function failure(res) {
    const body = await res.text();
    try {
      const parsed = JSON.parse(body);
      if (parsed && parsed.message) {
        return new Error(parsed.error ? `${parsed.error}: ${parsed.message}` : parsed.message);
      }
    } catch (_) {
      /* not JSON — fall through */
    }
    if (/^\s*</.test(body)) {
      return new Error(`The server returned an error page (HTTP ${res.status}). Check the server log.`);
    }
    return new Error(body.slice(0, 300) || `HTTP ${res.status}`);
  }

  // --- server record -> screen record ----------------------------------

  const mapOutlet = (r) => ({ outlet: s(r.Outlet), amount: n(r.Amount), share: n(r.Share) });
  const mapProduct = (r) => ({ product: s(r.Product), amount: n(r.Amount), qty: n(r.Quantity) });
  const mapMonth = (r) => ({ month: s(r.Month), amount: n(r.Amount) });

  const mapRow = (r) => ({
    group: s(r.OutletGroup),
    outlet: s(r.Outlet),
    invoice: s(r["Invoice No"]),
    date: s(r.Date),
    month: s(r.Month),
    product: s(r.Product),
    qty: n(r.Quantity),
    uom: s(r.UOM),
    unit: n(r["Unit Price"]),
    amount: n(r.Amount),
    code: s(r.Code),
    raw: s(r["Raw Name"]),
    status: s(r["Mapping Status"]) || "unmapped",
  });

  function mapStats(stats) {
    const st = stats || {};
    const pair = (v) => (Array.isArray(v) ? { name: s(v[0]), amount: n(v[1]) } : null);
    return {
      totalSales: n(st.total_sales),
      period: periodLabel(st.period),
      periodRaw: st.period || null,
      invoices: n(st.invoice_count),
      lineItems: n(st.line_item_count),
      outlets: n(st.outlet_count),
      stores: n(st.store_count),
      products: n(st.product_count),
      unmappedRows: n(st.unmapped_rows),
      unmappedNames: st.unmapped_names || [],
      bestOutlet: pair(st.best_outlet),
      bestStore: pair(st.best_store),
      bestProduct: pair(st.best_product),
      bestMonth: pair(st.best_month),
      bestOutletByMonth: (st.best_outlet_by_month || []).map((r) => ({
        month: s(r.Month),
        outlet: s(r.Outlet),
        amount: n(r.Amount),
      })),
    };
  }

  /**
   * The Mapping Manager needs three states, but the library only stores
   * confirmed pairs. "observed" carries how each raw name in the cleaned data
   * actually resolved, so unmapped names surface alongside the library.
   */
  function mapMappings(payload) {
    const branchKeywords = new Set(
      (payload.branch_rules || []).map((r) => s(r.pattern).toUpperCase())
    );
    return {
      // Store Names: keyword (name or code) -> OutletGroup.
      stores: (payload.stores || []).map((r) => ({ keyword: s(r.keyword), store: s(r.store) })),
      // Branch names: every invoice code in the data with its resolution.
      codes: (payload.codes || []).map((c) => ({
        code: s(c.code),
        raw: s(c.raw),
        branch: s(c.branch),
        store: s(c.store),
        dropped: !!c.dropped,
        amount: n(c.amount),
        // True when a keyword set the branch, false when it fell back to the code.
        assigned: branchKeywords.has(s(c.code).toUpperCase()),
      })),
    };
  }

  /**
   * "10094 KUBANG KERIAN" -> "KUBANG KERIAN". Branch names arrive prefixed with
   * an internal number, so the branch itself is the rest of the string. Used to
   * prefill the keyword box, never applied on its own.
   */
  function suggestKeyword(rawName) {
    return s(rawName).replace(/^\s*\d{3,}\s*/, "").trim();
  }

  // --- public surface ---------------------------------------------------

  const API = {
    live: false,
    sample: null, // the pristine data.js dataset, kept for offline fallback

    async reports() {
      const d = await get("/api/reports");
      return {
        stats: mapStats(d.stats),
        byOutlet: (d.by_outlet || []).map(mapOutlet),
        byStore: (d.by_store || []).map((r) => ({ store: s(r.OutletGroup), amount: n(r.Amount), share: n(r.Share) })),
        contribution: (d.contribution || []).map(mapProduct),
        monthly: (d.monthly || []).map(mapMonth),
        bestProductByOutlet: (d.best_product_per_outlet || []).map((r) => ({
          outlet: s(r.Outlet),
          product: s(r.Product),
          amount: n(r.Amount),
        })),
      };
    },

    async table({ group, outlet, month, limit = 500 } = {}) {
      const q = new URLSearchParams();
      if (group) q.set("group", group);
      if (outlet) q.set("outlet", outlet);
      if (month) q.set("month", month);
      q.set("limit", limit);
      const d = await get(`/api/table?${q}`);
      return {
        total: n(d.total),
        groups: d.groups || [],
        outlets: d.outlets || [],
        months: d.months || [],
        rows: (d.rows || []).map(mapRow),
      };
    },

    /** Decomposition tree: ranked children at each level under `path`. */
    async tree(path = [], { lkaOnly = true } = {}) {
      const params = new URLSearchParams();
      if (path.length) params.set("path", path.join("|"));
      // In-scope (store-matched) rows are the default; "All customers" adds the
      // dropped rows back in.
      if (!lkaOnly) params.set("include_unmatched", "1");
      const qs = params.toString();
      const d = await get("/api/tree" + (qs ? "?" + qs : ""));
      return {
        total: n(d.total),
        levels: (d.levels || []).map((lv) => ({
          dimension: s(lv.dimension),
          selected: lv.selected == null ? null : s(lv.selected),
          items: (lv.items || []).map((i) => ({ name: s(i.name), amount: n(i.amount) })),
        })),
      };
    },

    async outletProducts(outlet) {
      const d = await get(`/api/reports/outlet/${encodeURIComponent(outlet)}`);
      return {
        outlet: s(d.outlet),
        total: n(d.total),
        pages: (d.pages || []).map((page) => page.map(mapProduct)),
      };
    },

    async mappings() {
      return mapMappings(await get("/api/mappings"));
    },

    /**
     * stores: [{keyword, store}] — broad name/code -> store; empty store deletes.
     * codes:  [{code, branch, store}] — per invoice code; empty clears that field.
     */
    async saveMappings({ stores = [], codes = [] } = {}) {
      const res = await fetch("/api/mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stores, codes }),
      });
      if (!res.ok) throw await failure(res);
      return res.json();
    },

    /** Re-resolve outlets on the stored clean table, without re-uploading. */
    async remap() {
      const res = await fetch("/api/remap", { method: "POST" });
      if (!res.ok) throw await failure(res);
      const d = await res.json();
      return { rows: n(d.rows), stats: mapStats(d.stats) };
    },

    async upload(file) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw await failure(res);
      const d = await res.json();
      return {
        invoices: n(d.invoices),
        lineItems: n(d.line_items),
        dateFrom: s(d.date_from),
        dateTo: s(d.date_to),
        reportedRange: d.reported_range || null,
        rawNames: n(d.raw_names),
        unmappedNames: d.unmapped_names || [],
        continuationRows: n(d.continuation_rows),
        discardedRows: n(d.discarded_rows),
        suggestions: d.suggestions || {},
      };
    },

    async clean(file, { seed = false } = {}) {
      const body = new FormData();
      body.append("file", file);
      body.append("seed", String(seed));
      const res = await fetch("/api/clean", { method: "POST", body });
      if (!res.ok) throw await failure(res);
      const d = await res.json();
      return { rows: n(d.rows), stats: mapStats(d.stats) };
    },

    exportUrl(fmt, { group, outlet, month } = {}) {
      const q = new URLSearchParams();
      if (group) q.set("group", group);
      if (outlet) q.set("outlet", outlet);
      if (month) q.set("month", month);
      const qs = q.toString();
      return `/api/export/${fmt}${qs ? "?" + qs : ""}`;
    },

    /** Company-wide brand totals for the dashboard pie. */
    async brands() {
      const d = await get("/api/brands");
      return {
        total: n(d.total),
        brands: (d.brands || []).map((b) => ({ product: s(b.name), amount: n(b.amount) })),
      };
    },

    /** Drill: no args -> outlets, {outlet} -> its brands, {outlet,brand} -> products. */
    async breakdown({ outlet, brand } = {}) {
      const q = new URLSearchParams();
      if (outlet) q.set("outlet", outlet);
      if (brand) q.set("brand", brand);
      const qs = q.toString();
      const d = await get("/api/breakdown" + (qs ? "?" + qs : ""));
      return {
        level: s(d.level),
        outlet: s(d.outlet),
        brand: s(d.brand),
        items: (d.items || []).map((i) => ({ name: s(i.name), amount: n(i.amount) })),
      };
    },

    /** Forget the cleaned table. Returns false when the server is unreachable. */
    async reset() {
      try {
        const res = await fetch("/api/reset", { method: "POST" });
        return res.ok;
      } catch (_) {
        return false; // server not running
      }
    },

    /**
     * Pull everything the screens read at first paint into window.INVOICE.
     * With {fresh:true} it first clears any stored data, so a page refresh
     * starts empty until a file is uploaded. Returns true when live data loaded.
     */
    async boot({ fresh = false } = {}) {
      API.sample = JSON.parse(JSON.stringify(window.INVOICE));
      if (fresh) {
        const reachable = await API.reset();
        emptyDataset();
        // If the reset call couldn't reach the backend, the server is down —
        // flag it so the UI can tell the user to restart it, rather than
        // pretending everything is fine and failing on the next action.
        API.serverDown = !reachable;
        API.live = reachable;
        API.empty = true;
        return false;
      }
      try {
        const [reports, table, mappings, brands] = await Promise.all([
          API.reports(),
          API.table({ limit: 500 }),
          API.mappings(),
          API.brands(),
        ]);

        // Nothing cleaned yet — show the empty state, not the sample.
        if (!table.total && !reports.byOutlet.length) {
          emptyDataset();
          API.live = true;
          API.empty = true;
          return false;
        }

        Object.assign(window.INVOICE, {
          // The sample's upload metadata describes a file that isn't loaded.
          file: null,
          stats: reports.stats,
          byOutlet: reports.byOutlet,
          byStore: reports.byStore,
          contribution: reports.contribution,
          monthly: reports.monthly,
          brandPie: brands.brands,
          bestProductByOutlet: reports.bestProductByOutlet,
          rows: table.rows,
          groups: table.groups,
          outlets: table.outlets,
          months: table.months,
          total: table.total,
          stores: mappings.stores,
          codes: mappings.codes,
          parse: {
            invoices: reports.stats.invoices,
            lineItems: reports.stats.lineItems,
            dateFrom: "",
            dateTo: "",
            rawNames: mappings.codes.length,
            continuationRows: 0,
            discardedRows: 0,
          },
          productsByOutlet: {}, // fetched per outlet by the Reports screen
        });

        API.live = true;
        return true;
      } catch (err) {
        console.warn("[api] falling back to sample data:", err.message);
        API.live = false;
        return false;
      }
    },
  };

  window.API = API;
  window.monthLabel = monthLabel;
  window.suggestKeyword = suggestKeyword;

  /**
   * Best month for the stat cards. The API computes it; offline we derive it
   * from the monthly series so the card never shows a hardcoded date.
   */
  window.bestMonth = function (d) {
    const fromStats = d.stats && d.stats.bestMonth;
    if (fromStats && fromStats.name) {
      return { label: monthLabel(fromStats.name), amount: fromStats.amount };
    }
    const top = (d.monthly || []).reduce((a, m) => (a && a.amount >= m.amount ? a : m), null);
    return top ? { label: monthLabel(top.month), amount: top.amount } : { label: "—", amount: 0 };
  };

  /** Best outlet per month, live or derived — used by the Reports screen. */
  window.bestOutletByMonth = function (d) {
    const live = d.stats && d.stats.bestOutletByMonth;
    if (live && live.length) {
      return live
        .slice()
        .sort((a, b) => a.month.localeCompare(b.month))
        .map((r) => ({ label: monthLabel(r.month), outlet: r.outlet, amount: r.amount }));
    }
    return (d.bestOutletByMonth || []).map((r) => ({
      label: monthLabel(r.month),
      outlet: r.outlet,
      amount: r.amount,
    }));
  };
})();
