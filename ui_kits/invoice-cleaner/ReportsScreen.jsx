const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

const PER_PAGE = 24; // matches reports.BARS_PER_PAGE

function ReportsScreen() {
  const d = window.INVOICE;
  const live = window.API.live;

  const outletNames = live
    ? d.byOutlet.map((o) => o.outlet)
    : Object.keys(d.productsByOutlet || {});

  const [outlet, setOutlet] = React.useState(outletNames[0] || "");
  const [page, setPage] = React.useState(0);
  const [pages, setPages] = React.useState([]);
  const [outletTotal, setOutletTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  // The API paginates per outlet server-side, so the products for one outlet
  // are fetched on selection rather than shipped with the first payload.
  React.useEffect(() => {
    let cancelled = false;
    if (!outlet) return;
    if (!live) {
      const rows = (d.productsByOutlet || {})[outlet] || [];
      const chunks = [];
      for (let i = 0; i < rows.length; i += PER_PAGE) chunks.push(rows.slice(i, i + PER_PAGE));
      setPages(chunks.length ? chunks : [[]]);
      setOutletTotal(rows.reduce((a, p) => a + p.amount, 0));
      return;
    }
    setLoading(true);
    window.API.outletProducts(outlet)
      .then((res) => {
        if (cancelled) return;
        setPages(res.pages.length ? res.pages : [[]]);
        setOutletTotal(res.total);
      })
      .catch(() => !cancelled && setPages([[]]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [outlet, live]);

  const pageCount = Math.max(1, pages.length);
  const rows = pages[Math.min(page, pageCount - 1)] || [];

  const topOutlet = d.byOutlet[0] || { outlet: "—", amount: 0 };
  const bestProduct = (d.stats.bestProduct && d.stats.bestProduct.name)
    ? d.stats.bestProduct
    : (d.contribution[0] ? { name: d.contribution[0].product, amount: d.contribution[0].amount } : { name: "—", amount: 0 });
  const bestMonth = window.bestMonth(d);
  const share = d.stats.totalSales ? (bestProduct.amount / d.stats.totalSales) * 100 : 0;
  const perMonth = window.bestOutletByMonth(d);

  return (
    <div>
      <PageHead kicker={`Yearly overview · ${d.stats.period || "—"}`} title="Reports"
        actions={<>
          <GhostButton icon="download" href={live ? window.API.exportUrl("csv") : null} disabled={!live}>CSV</GhostButton>
          <GhostButton icon="download" href={live ? window.API.exportUrl("xlsx") : null} disabled={!live}>XLSX</GhostButton>
          <Button size="sm" iconLeft={<Icon name="file-down" size={16} />} onClick={() => window.print()}>Download PDF</Button>
        </>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
        <StatCard tone="ink" label="Total sales, period" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard tone="#0a7281" label="Best-selling outlet" value={topOutlet.outlet} sub={window.RM(topOutlet.amount)} />
        <StatCard tone="#7c3aed" label="Best-selling product" value={bestProduct.name}
          sub={`${window.RM(bestProduct.amount)} · ${share.toFixed(1)}% of total`} />
        <StatCard tone="#2563eb" label="Best month" value={bestMonth.label} sub={window.RM(bestMonth.amount)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Panel title="1 — Yearly overview: sales by outlet"
          note={`${d.stats.outlets || d.byOutlet.length} outlets · ${window.RM(d.stats.totalSales)} company-wide · ${d.stats.period || "—"}`}>
          <BarList rows={d.byOutlet} />
        </Panel>

        <Panel title="2 — Product sales per outlet"
          note={loading ? "Loading…" : `${outlet} · ${window.RM(outletTotal)}`}
          actions={<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Select value={outlet} onChange={(v) => { setOutlet(v); setPage(0); }} options={outletNames} />
            <span style={{ fontSize: 13, color: "var(--mute)", whiteSpace: "nowrap" }}>Page {Math.min(page, pageCount - 1) + 1} of {pageCount}</span>
          </div>}>
          <BarList rows={rows} labelKey="product" />
          {pageCount > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <GhostButton icon="chevron-left" onClick={() => setPage(Math.max(0, page - 1))}>Previous</GhostButton>
              <GhostButton icon="chevron-right" onClick={() => setPage(Math.min(pageCount - 1, page + 1))}>Next</GhostButton>
            </div>
          )}
        </Panel>

        <Panel title="3 — Product contribution to total sales" note="Top products as named slices, everything else rolled into Others">
          <Donut rows={d.contribution} />
        </Panel>

        {/* Empty whenever every product is already a named slice. */}
        {d.others.length > 0 && (
          <Panel title={'“Others” — detailed breakdown'} note="What sits inside the Others slice, as a share of company-wide sales">
            <Donut rows={d.others} />
          </Panel>
        )}

        {perMonth.length > 0 && (
          <Panel title="Best-selling outlet per month">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {perMonth.map((r) => (
                <div key={r.label} style={{ background: "var(--soft-cloud)", padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{r.outlet}</div>
                  <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{window.RM(r.amount)}</div>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ReportsScreen });
