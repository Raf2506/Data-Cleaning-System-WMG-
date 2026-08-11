const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function ReportsScreen() {
  const d = window.INVOICE;
  const [outlet, setOutlet] = React.useState("ECONSAVE");
  const [page, setPage] = React.useState(0);
  const products = d.productsByOutlet[outlet] || d.productsByOutlet.ECONSAVE;
  const perPage = 24;
  const pages = Math.max(1, Math.ceil(products.length / perPage));
  const outletTotal = products.reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <PageHead kicker={`Yearly overview · ${d.stats.period}`} title="Reports"
        actions={<><GhostButton icon="download">CSV</GhostButton><GhostButton icon="download">XLSX</GhostButton><Button size="sm" iconLeft={<Icon name="file-down" size={16} />}>Download PDF</Button></>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
        <StatCard tone="ink" label="Total sales, period" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard label="Best-selling outlet" value={d.byOutlet[0].outlet} sub={window.RM(d.byOutlet[0].amount)} />
        <StatCard label="Best-selling product" value="Carbonara Mushroom" sub={window.RM(d.contribution[0].amount) + " · 14.2% of total"} />
        <StatCard label="Best month" value="Jun 2026" sub={window.RM(781240.9)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Panel title="1 — Yearly overview: sales by outlet"
          note={`${d.stats.outlets} outlets · ${window.RM(d.stats.totalSales)} company-wide · ${d.stats.period}`}>
          <BarList rows={d.byOutlet} />
        </Panel>

        <Panel title="2 — Product sales per outlet"
          note={`${outlet} · ${window.RM(outletTotal)}`}
          actions={<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Select value={outlet} onChange={(v) => { setOutlet(v); setPage(0); }} options={Object.keys(d.productsByOutlet)} />
            <span style={{ fontSize: 13, color: "var(--mute)", whiteSpace: "nowrap" }}>Page {page + 1} of {pages}</span>
          </div>}>
          <BarList rows={products.slice(page * perPage, (page + 1) * perPage)} labelKey="product" />
          {pages > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <GhostButton icon="chevron-left" onClick={() => setPage(Math.max(0, page - 1))}>Previous</GhostButton>
              <GhostButton icon="chevron-right" onClick={() => setPage(Math.min(pages - 1, page + 1))}>Next</GhostButton>
            </div>
          )}
        </Panel>

        <Panel title="3 — Product contribution to total sales" note="Top products as named slices, everything else rolled into Others">
          <Donut rows={d.contribution} />
        </Panel>

        <Panel title={'“Others” — detailed breakdown'} note="What sits inside the Others slice, as a share of company-wide sales">
          <Donut rows={d.others} />
        </Panel>

        <Panel title="Best-selling outlet per month">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[["Jan 2026", "ECONSAVE", 182400.5], ["Feb 2026", "ECONSAVE", 174220.0], ["Mar 2026", "BORONG DIN AS CASH & CARRY", 168840.75], ["Apr 2026", "ECONSAVE", 191240.3], ["May 2026", "MYDIN", 158920.4], ["Jun 2026", "ECONSAVE", 204110.9], ["Jul 2026", "ECONSAVE", 186880.25]].map(([m, o, v]) => (
              <div key={m} style={{ background: "var(--soft-cloud)", padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>{m}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{o}</div>
                <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{window.RM(v)}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { ReportsScreen });
