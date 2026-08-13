const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function DashboardScreen({ onNavigate }) {
  const d = window.INVOICE;
  const byStore = d.byStore || [];
  const topStore = byStore[0] || { store: "—", amount: 0 };
  const best = window.bestMonth(d);
  const shown = Math.min(10, byStore.length);
  const empty = !d.total;

  // Before any file is uploaded the dashboard is a blank slate with one action.
  if (empty) {
    return (
      <div>
        <PageHead kicker="Overview" title="Dashboard" />
        <Panel>
          <div style={{ padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Icon name="upload-cloud" size={40} color="var(--mute)" />
            <div style={{ fontSize: 20, fontWeight: 600 }}>No data yet</div>
            <div style={{ fontSize: 14, color: "var(--mute)", maxWidth: "44ch", lineHeight: 1.6 }}>
              Upload an Invoice Listing export to clean it and see sales by store, brand and product. The dashboard stays empty until then.
            </div>
            <Button onClick={() => onNavigate("upload")}>Upload a file</Button>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <PageHead kicker="Overview" title="Dashboard" actions={<Button size="sm" onClick={() => onNavigate("upload")}>Upload new file</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        <StatCard tone="ink" label="Total sales" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard tone="#0a7281" label="Best store" value={topStore.store} sub={window.RM(topStore.amount)} />
        <StatCard tone="#2563eb" label="Best month" value={best.label} sub={window.RM(best.amount)} />
        <StatCard tone={d.stats.unmappedRows ? "#dc2626" : "#16a34a"} label="Unmapped rows" value={d.stats.unmappedRows.toLocaleString()} sub="Flagged, not dropped — resolve in Mapping Manager" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 8, marginBottom: 8 }}>
        <Panel title="Sales by store" note={`Top ${shown} of ${d.stats.stores || byStore.length}, descending`} actions={<GhostButton icon="arrow-right" onClick={() => onNavigate("reports")}>Full report</GhostButton>}>
          <BarList rows={byStore.slice(0, 10)} labelKey="store" colorKey="store" />
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

      <Panel title="Brand sales, company-wide" note="Share of sales by brand — PAPADAM counts under CIK SURI">
        {d.brandPie && d.brandPie.length
          ? <Donut rows={d.brandPie} />
          : <div style={{ padding: "24px", color: "var(--mute)", fontSize: 14 }}>No brand data.</div>}
      </Panel>
    </div>
  );
}

Object.assign(window, { DashboardScreen });
