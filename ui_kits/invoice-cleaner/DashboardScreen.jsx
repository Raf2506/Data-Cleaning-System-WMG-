const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function DashboardScreen({ onNavigate }) {
  const d = window.INVOICE;
  return (
    <div>
      <PageHead kicker="Overview" title="Dashboard" actions={<Button size="sm" onClick={() => onNavigate("upload")}>Upload new file</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        <StatCard tone="ink" label="Total sales" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard label="Best outlet" value={d.byOutlet[0].outlet} sub={window.RM(d.byOutlet[0].amount)} />
        <StatCard label="Best month" value="Jun 2026" sub={window.RM(781240.9)} />
        <StatCard label="Unmapped rows" value={d.stats.unmappedRows.toLocaleString()} sub="Flagged, not dropped — resolve in Mapping Manager" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 8, marginBottom: 8 }}>
        <Panel title="Sales by outlet" note="Top 10 of 27, descending" actions={<GhostButton icon="arrow-right" onClick={() => onNavigate("reports")}>Full report</GhostButton>}>
          <BarList rows={d.byOutlet} />
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Panel title="Latest upload" pad={0}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--hairline-soft)" }}>
              <div style={{ fontSize: 15, fontWeight: 600, wordBreak: "break-all" }}>{d.file.name}</div>
              <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{d.file.uploaded} · {d.file.size}</div>
            </div>
            {[["Raw rows in file", d.file.rows.toLocaleString()], ["Invoices parsed", d.parse.invoices.toLocaleString()], ["Line items", d.parse.lineItems.toLocaleString()], ["Date range detected", "1 Jan – 31 Jul 2026"], ["Distinct raw names", d.parse.rawNames]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 24px", borderBottom: "1px solid var(--hairline-soft)", fontSize: 13 }}>
                <span style={{ color: "var(--mute)" }}>{k}</span>
                <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
              </div>
            ))}
            <div style={{ padding: 16, display: "flex", gap: 8 }}>
              <GhostButton icon="download">CSV</GhostButton>
              <GhostButton icon="download">XLSX</GhostButton>
            </div>
          </Panel>

          <Panel title="Go to" pad={0}>
            {NAV.filter((n) => n.id !== "dashboard").map((n) => (
              <button key={n.id} onClick={() => onNavigate(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 24px", background: "none", border: "none", borderBottom: "1px solid var(--hairline-soft)", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 500, color: "var(--ink)", textAlign: "left" }}>
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
