const { Icon, Button, SearchPill } = window.SubtleGradientDesignSystem_21f929;

const money = (v) => (typeof v === "number" && isFinite(v) ? v.toFixed(2) : "—");

function TableScreen() {
  const d = window.INVOICE;
  const live = window.API.live;

  // Live, the server knows every outlet and month; offline we only have the
  // sample rows, so derive the lists from them.
  const outlets = live && d.outlets ? d.outlets : Array.from(new Set(d.rows.map((r) => r.outlet)));
  const months = live && d.months ? d.months : Array.from(new Set(d.rows.map((r) => r.month))).sort();

  const [mode, setMode] = React.useState("all");
  const [outlet, setOutlet] = React.useState(outlets[0] || "");
  const [month, setMonth] = React.useState(months[0] || "");
  const [generated, setGenerated] = React.useState(false);
  const [filtered, setFiltered] = React.useState({ rows: [], total: 0 });
  const [loading, setLoading] = React.useState(false);

  async function generate() {
    if (!live) {
      setFiltered({
        rows: d.rows.filter((r) => r.outlet === outlet && r.month === month),
        total: 0,
      });
      return setGenerated(true);
    }
    setLoading(true);
    try {
      const res = await window.API.table({ outlet, month });
      setFiltered({ rows: res.rows, total: res.total });
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  }

  const showing = mode === "all" ? d.rows : generated ? filtered.rows : [];
  const totalRows = mode === "all" ? (d.total || d.rows.length) : filtered.total || filtered.rows.length;
  const exportFilter = mode === "filtered" && generated ? { outlet, month } : {};

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 14px", borderBottom: "1px solid var(--ink)", whiteSpace: "nowrap" };
  const td = { padding: "11px 14px", fontSize: 13, borderBottom: "1px solid var(--hairline-soft)", whiteSpace: "nowrap" };
  const num = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };

  return (
    <div>
      <PageHead kicker="Step 3" title="Clean Data Table"
        actions={<>
          <GhostButton icon="download" href={live ? window.API.exportUrl("csv", exportFilter) : null} disabled={!live}>CSV</GhostButton>
          <GhostButton icon="download" href={live ? window.API.exportUrl("xlsx", exportFilter) : null} disabled={!live}>XLSX</GhostButton>
        </>} />

      <div style={{ display: "flex", gap: 0, marginBottom: 8, border: "1px solid var(--hairline)" }}>
        {[["all", "All months"], ["filtered", "Outlet + Month"]].map(([id, label]) => (
          <button key={id} onClick={() => { setMode(id); setGenerated(false); }} style={{ flex: 1, padding: "12px 20px", background: mode === id ? "var(--ink)" : "var(--canvas)", color: mode === id ? "var(--canvas)" : "var(--ink)", border: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 600 }}>{label}</button>
        ))}
      </div>

      {mode === "filtered" && (
        <div style={{ background: "var(--soft-cloud)", border: "1px solid var(--hairline)", padding: 20, marginBottom: 8, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ marginRight: "auto" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Generate detailed monthly report</div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>Filters the clean table to one outlet, one month, and exports it.</div>
          </div>
          <Select label="Outlet" value={outlet} onChange={setOutlet} options={outlets} />
          <Select label="Month" value={month} onChange={setMonth} options={months} />
          <Button size="sm" onClick={generate}>{loading ? "Loading…" : "Generate"}</Button>
        </div>
      )}

      <Panel pad={0}
        title={mode === "all" ? "All cleaned line items" : `${outlet} · ${month}`}
        note={mode === "all"
          ? `${totalRows.toLocaleString()} rows · ${d.stats.period || "—"} · showing first ${showing.length}`
          : generated ? `${totalRows.toLocaleString()} rows in this view` : "Pick an outlet and month, then Generate."}
        actions={<div style={{ display: "flex", gap: 12, alignItems: "center" }}><StatusTag status="unmapped" /><span style={{ fontSize: 13, color: "var(--mute)" }}>{d.stats.unmappedRows.toLocaleString()} flagged rows</span></div>}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
            <thead><tr>
              <th style={th}>Outlet</th><th style={th}>Invoice No</th><th style={th}>Date</th><th style={th}>Product</th>
              <th style={{ ...th, textAlign: "right" }}>Qty</th><th style={th}>UOM</th>
              <th style={{ ...th, textAlign: "right" }}>Unit price</th><th style={{ ...th, textAlign: "right" }}>Amount</th>
              <th style={th}>Raw name</th><th style={th}>Mapping</th>
            </tr></thead>
            <tbody>
              {showing.map((r, i) => (
                <tr key={i} style={{ background: r.status === "unmapped" ? "#fff4f4" : "transparent" }}>
                  <td style={{ ...td, fontWeight: 600 }}>{r.outlet}</td>
                  <td style={{ ...td, fontFamily: "ui-monospace, monospace" }}>{r.invoice}</td>
                  <td style={td}>{r.date}</td>
                  <td style={{ ...td, whiteSpace: "normal", minWidth: 280, color: "var(--charcoal)" }}>{r.product}</td>
                  <td style={num}>{r.qty}</td>
                  <td style={{ ...td, color: "var(--mute)" }}>{r.uom}</td>
                  <td style={num}>{money(r.unit)}</td>
                  <td style={{ ...num, fontWeight: 600 }}>{money(r.amount)}</td>
                  <td style={{ ...td, color: "var(--mute)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>{r.raw || "—"}</td>
                  <td style={td}><StatusTag status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {mode === "filtered" && !generated && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>Nothing generated yet.</div>
          )}
          {mode === "filtered" && generated && !showing.length && (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>No rows for {outlet} in {month}.</div>
          )}
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { TableScreen });
