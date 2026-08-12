const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function DashboardScreen({ onNavigate }) {
  const d = window.INVOICE;
  const top = d.byOutlet[0] || { outlet: "—", amount: 0 };
  const best = window.bestMonth(d);
  const shown = Math.min(10, d.byOutlet.length);

  return (
    <div>
      <PageHead kicker="Overview" title="Dashboard" actions={<Button size="sm" onClick={() => onNavigate("upload")}>Upload new file</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        <StatCard tone="ink" label="Total sales" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard tone="#0a7281" label="Best outlet" value={top.outlet} sub={window.RM(top.amount)} />
        <StatCard tone="#2563eb" label="Best month" value={best.label} sub={window.RM(best.amount)} />
        <StatCard tone={d.stats.unmappedRows ? "#dc2626" : "#16a34a"} label="Unmapped rows" value={d.stats.unmappedRows.toLocaleString()} sub="Flagged, not dropped — resolve in Mapping Manager" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 8, marginBottom: 8 }}>
        <Panel title="Sales by outlet" note={`Top ${shown} of ${d.stats.outlets || d.byOutlet.length}, descending`} actions={<GhostButton icon="arrow-right" onClick={() => onNavigate("reports")}>Full report</GhostButton>}>
          <BarList rows={d.byOutlet.slice(0, 10)} />
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Panel title={d.file ? "Latest upload" : "Active dataset"} pad={0}>
            {d.file && (
              <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--hairline-soft)" }}>
                <div style={{ fontSize: 15, fontWeight: 600, wordBreak: "break-all" }}>{d.file.name}</div>
                <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{d.file.uploaded} · {d.file.size}</div>
              </div>
            )}
            {[
              ...(d.file ? [["Raw rows in file", d.file.rows.toLocaleString()]] : []),
              ["Invoices parsed", d.parse.invoices.toLocaleString()],
              ["Line items", d.parse.lineItems.toLocaleString()],
              ["Period", d.stats.period || "—"],
              ["Outlets", (d.stats.outlets || 0).toLocaleString()],
              ["Distinct raw names", d.parse.rawNames],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 24px", borderBottom: "1px solid var(--hairline-soft)", fontSize: 13 }}>
                <span style={{ color: "var(--mute)" }}>{k}</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
              </div>
            ))}
            <div style={{ padding: 16, display: "flex", gap: 8 }}>
              <GhostButton icon="download" href={window.API.live ? window.API.exportUrl("csv") : null} disabled={!window.API.live}>CSV</GhostButton>
              <GhostButton icon="download" href={window.API.live ? window.API.exportUrl("xlsx") : null} disabled={!window.API.live}>XLSX</GhostButton>
            </div>
          </Panel>

          <Panel title="Go to" pad={0}>
            {NAV.filter((n) => n.id !== "dashboard").map((n) => (
              <button key={n.id} className="golink" onClick={() => onNavigate(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 24px", background: "none", border: "none", borderBottom: "1px solid var(--hairline-soft)", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 500, color: "var(--ink)", textAlign: "left" }}>
                <Icon name={n.icon} size={17} />{n.label}
                <Icon name="chevron-right" size={16} style={{ marginLeft: "auto", color: "var(--stone)" }} />
              </button>
            ))}
          </Panel>
        </div>
      </div>

      <Panel title="Monthly sales, company-wide" note="Computed from the uploaded range — not a fixed calendar">
        <ColumnChart rows={d.monthly} />
      </Panel>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
