const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

const RENDER_LIMIT = 300; // rows drawn at once; export has the full table
const money = (v) => (typeof v === "number" && isFinite(v) ? v.toFixed(2) : "—");

/**
 * Type-ahead store picker. The list is the OutletGroups present in the current
 * data — one SRI TERNAK covering every ST ROSYAM / SRI TERNAK branch, not each
 * raw branch name — and only stores the file actually contains.
 */
function OutletSearch({ outlets, value, onChange }) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    const away = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = q ? outlets.filter((o) => o.toLowerCase().includes(q)) : outlets;

  const pick = (o) => { onChange(o); setQuery(""); setOpen(false); };

  return (
    <div ref={boxRef} style={{ position: "relative", flex: 1, minWidth: 260 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 6 }}>Store</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", background: "var(--canvas)", border: "1px solid var(--hairline)" }}>
        <Icon name="search" size={16} color="var(--mute)" />
        <input
          value={open || !value ? query : value}
          placeholder={value ? value : `Search ${outlets.length} stores…`}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "inherit", fontSize: 14, color: "var(--ink)" }}
        />
        {value && (
          <button onClick={() => { onChange(""); setQuery(""); }} title="Clear" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--mute)", display: "flex" }}>
            <Icon name="x" size={15} />
          </button>
        )}
      </div>
      {open && (
        <div style={{ position: "absolute", zIndex: 20, top: "100%", left: 0, right: 0, maxHeight: 320, overflowY: "auto", background: "var(--canvas)", border: "1px solid var(--ink)", borderTop: "none" }}>
          {matches.length ? matches.map((o) => (
            <button key={o} onClick={() => pick(o)}
              style={{ display: "block", width: "100%", textAlign: "left", border: "none", borderBottom: "1px solid var(--hairline-soft)", background: o === value ? "var(--soft-cloud)" : "var(--canvas)", cursor: "pointer", padding: "9px 14px", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "var(--ink)" }}>
              {o}
            </button>
          )) : (
            <div style={{ padding: "14px", fontSize: 13, color: "var(--mute)" }}>No store matches “{query}”.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TableScreen() {
  const d = window.INVOICE;
  const live = window.API.live;

  const stores = live && d.groups ? d.groups : Array.from(new Set(d.rows.map((r) => r.group).filter(Boolean))).sort();
  const months = live && d.months ? d.months : Array.from(new Set(d.rows.map((r) => r.month))).sort();

  const [store, setStore] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [rows, setRows] = React.useState(d.rows);
  const [total, setTotal] = React.useState(d.total || d.rows.length);
  const [loading, setLoading] = React.useState(false);

  // Refetch whenever the filter changes. No filter = the whole in-scope table.
  React.useEffect(() => {
    let cancelled = false;
    if (!live) {
      const f = d.rows.filter((r) => (!store || r.group === store) && (!month || r.month === month));
      setRows(f); setTotal(f.length);
      return;
    }
    setLoading(true);
    // Render a light page (the server still reports the true total). Rendering
    // thousands of rows at once in the dev React build can freeze the tab; the
    // full data is available through CSV/XLSX export.
    window.API.table({ group: store || undefined, month: month || undefined, limit: RENDER_LIMIT })
      .then((res) => { if (!cancelled) { setRows(res.rows); setTotal(res.total); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [store, month, live]);

  const filter = {};
  if (store) filter.group = store;
  if (month) filter.month = month;
  const filtered = store || month;

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 14px", borderBottom: "1px solid var(--ink)", whiteSpace: "nowrap" };
  const td = { padding: "11px 14px", fontSize: 13, borderBottom: "1px solid var(--hairline-soft)", whiteSpace: "nowrap" };
  const num = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };

  return (
    <div>
      <PageHead kicker="Step 3" title="Clean Data Table"
        actions={<>
          <GhostButton icon="download" href={live ? window.API.exportUrl("csv", filter) : null} disabled={!live}>CSV</GhostButton>
          <GhostButton icon="download" href={live ? window.API.exportUrl("xlsx", filter) : null} disabled={!live}>XLSX</GhostButton>
        </>} />

      <div style={{ background: "var(--soft-cloud)", border: "1px solid var(--hairline)", padding: 16, marginBottom: 8, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
        <OutletSearch outlets={stores} value={store} onChange={setStore} />
        <Select label="Month" value={month || "All months"} onChange={(v) => setMonth(v === "All months" ? "" : v)} options={["All months", ...months]} />
        {filtered && <Button size="sm" variant="secondary" onClick={() => { setStore(""); setMonth(""); }}>Clear</Button>}
      </div>

      <Panel pad={0}
        title={store ? `${store}${month ? " · " + month : ""}` : month ? month : "All cleaned line items"}
        note={loading ? "Loading…" : `${total.toLocaleString()} rows${filtered ? " in this view" : ` · ${d.stats.period || "—"}`} · showing ${rows.length.toLocaleString()}`}>
        <div style={{ overflowX: "auto" }}>
          <table className="grid" style={{ width: "100%", borderCollapse: "collapse", minWidth: 1160 }}>
            <thead><tr>
              <th style={th}>Store</th><th style={th}>Outlet</th><th style={th}>Invoice No</th><th style={th}>Date</th><th style={th}>Product</th>
              <th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>UOM</th>
              <th style={{ ...th, textAlign: "right" }}>Unit price</th><th style={{ ...th, textAlign: "right" }}>Amount</th>
              <th style={th}>Raw name</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ ...td, fontWeight: 600 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 2, flex: "0 0 auto", background: window.colorFor(r.group) }} />
                      {r.group}
                    </span>
                  </td>
                  <td style={{ ...td, color: "var(--charcoal)" }}>{r.outlet}</td>
                  <td style={{ ...td, fontFamily: "ui-monospace, monospace" }}>{r.invoice}</td>
                  <td style={td}>{r.date}</td>
                  <td style={{ ...td, whiteSpace: "normal", minWidth: 280, color: "var(--charcoal)" }}>{r.product}</td>
                  <td style={num}>{r.qty}</td>
                  <td style={{ ...td, color: "var(--mute)" }}>{r.uom}</td>
                  <td style={num}>{money(r.unit)}</td>
                  <td style={{ ...num, fontWeight: 600 }}>{money(r.amount)}</td>
                  <td style={{ ...td, color: "var(--mute)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{r.raw || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && !loading && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>
              {filtered ? `No rows for ${store || month}.` : "No cleaned rows yet."}
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { TableScreen });
