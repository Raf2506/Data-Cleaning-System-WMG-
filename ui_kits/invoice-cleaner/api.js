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
      products: n(st.product_count),
      unmappedRows: n(st.unmapped_rows),
      unmappedNames: st.unmapped_names || [],
      bestOutlet: pair(st.best_outlet),
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
    const nameToGroup = payload.name_to_group || {};
    const observed = payload.observed || [];
    const rows = [];
    const seen = new Set();

    observed.forEach((o) => {
      const raw = s(o.raw);
      if (!raw || seen.has(raw)) return;
      seen.add(raw);
      const confirmed = Object.prototype.hasOwnProperty.call(nameToGroup, raw.toUpperCase());
      rows.push({
        raw,
        group: s(o.group),
        // Resolved through the code layer but absent from the name library —
        // the name itself is still not pinned down.
        status: o.status === "unmapped" ? "unmapped" : confirmed ? "mapped" : "suggested",
      });
    });

    // Library entries that this dataset happens not to contain.
    Object.keys(nameToGroup).forEach((raw) => {
      if (seen.has(raw)) return;
      rows.push({ raw, group: s(nameToGroup[raw]), status: "mapped" });
    });

    return {
      nameMap: rows,
      codeMap: (payload.code_rules || []).map((r) => ({
        pattern: s(r.pattern),
        group: s(r.group),
        match: r.exact ? "Exact" : "Fragment",
      })),
      // Names still unresolved after both layers — the queue of work.
      unresolved: observed
        .filter((o) => o.status === "unmapped")
        .map((o) => ({ raw: s(o.raw), code: s(o.code) })),
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
        contribution: (d.contribution || []).map(mapProduct),
        others: (d.others || []).map((r) => ({
          product: s(r.Product),
          amount: n(r.Amount),
          share: n(r["Share of Total"]),
        })),
        monthly: (d.monthly || []).map(mapMonth),
        bestProductByOutlet: (d.best_product_per_outlet || []).map((r) => ({
          outlet: s(r.Outlet),
          product: s(r.Product),
          amount: n(r.Amount),
        })),
      };
    },

    async table({ outlet, month, limit = 500 } = {}) {
      const q = new URLSearchParams();
      if (outlet) q.set("outlet", outlet);
      if (month) q.set("month", month);
      q.set("limit", limit);
      const d = await get(`/api/table?${q}`);
      return {
        total: n(d.total),
        outlets: d.outlets || [],
        months: d.months || [],
        rows: (d.rows || []).map(mapRow),
      };
    },

    /** Decomposition tree: ranked children at each level under `path`. */
    async tree(path = [], { lkaOnly = true } = {}) {
      const params = new URLSearchParams();
      if (path.length) params.set("path", path.join("|"));
      if (lkaOnly) params.set("scope", "lka");
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

    /** names: [{raw, group}] — group "" deletes. codes: [{pattern, group, exact}]. */
    async saveMappings({ names = [], codes = [] } = {}) {
      const res = await fetch("/api/mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names, codes }),
      });
      if (!res.ok) throw new Error(`save mappings → ${res.status}`);
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

    exportUrl(fmt, { outlet, month } = {}) {
      const q = new URLSearchParams();
      if (outlet) q.set("outlet", outlet);
      if (month) q.set("month", month);
      const qs = q.toString();
      return `/api/export/${fmt}${qs ? "?" + qs : ""}`;
    },

    /**
     * Pull everything the screens read at first paint into window.INVOICE.
     * Returns true when live data replaced the sample.
     */
    async boot() {
      API.sample = JSON.parse(JSON.stringify(window.INVOICE));
      try {
        const [reports, table, mappings] = await Promise.all([
          API.reports(),
          API.table({ limit: 500 }),
          API.mappings(),
        ]);

        // No upload has been cleaned yet — leave the sample in place so the
        // screens still demonstrate something, but say so.
        if (!table.total && !reports.byOutlet.length) {
          API.live = false;
          API.empty = true;
          return false;
        }

        Object.assign(window.INVOICE, {
          // The sample's upload metadata describes a file that isn't loaded.
          file: null,
          stats: reports.stats,
          byOutlet: reports.byOutlet,
          contribution: reports.contribution,
          others: reports.others,
          monthly: reports.monthly,
          bestProductByOutlet: reports.bestProductByOutlet,
          rows: table.rows,
          outlets: table.outlets,
          months: table.months,
          total: table.total,
          nameMap: mappings.nameMap,
          codeMap: mappings.codeMap,
          unresolved: mappings.unresolved,
          parse: {
            invoices: reports.stats.invoices,
            lineItems: reports.stats.lineItems,
            dateFrom: "",
            dateTo: "",
            rawNames: mappings.nameMap.length,
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
