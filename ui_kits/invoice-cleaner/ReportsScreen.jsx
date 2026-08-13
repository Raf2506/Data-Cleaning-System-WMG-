const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function ReportsScreen() {
  const d = window.INVOICE;
  const live = window.API.live;

  // Drill-down: click an outlet to see its brands, a brand to see its products.
  const [drillOutlet, setDrillOutlet] = React.useState("");
  const [drillBrand, setDrillBrand] = React.useState("");
  const [drillItems, setDrillItems] = React.useState(d.byOutlet.map((o) => ({ name: o.outlet, amount: o.amount })));
  const [drillLoading, setDrillLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    // Top level (no outlet selected) is the outlet list already in memory.
    if (!drillOutlet) { setDrillItems(d.byOutlet.map((o) => ({ name: o.outlet, amount: o.amount }))); return; }
    if (!live) return;
    setDrillLoading(true);
    window.API.breakdown({ outlet: drillOutlet, brand: drillBrand || undefined })
      .then((res) => { if (!cancelled) setDrillItems(res.items); })
      .catch(() => !cancelled && setDrillItems([]))
      .finally(() => !cancelled && setDrillLoading(false));
    return () => { cancelled = true; };
  }, [drillOutlet, drillBrand, live]);

  // Clicking a bar drills one level deeper; the breadcrumb steps back out.
  const onDrillClick = (row) => {
    if (!drillOutlet) setDrillOutlet(row.name);
    else if (!drillBrand) setDrillBrand(row.name);
    // At product level there is nowhere deeper to go.
  };
  const drillLevel = !drillOutlet ? "outlet" : !drillBrand ? "brand" : "product";
  const drillTotal = drillItems.reduce((a, r) => a + r.amount, 0);

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
        <Panel
          title={drillLevel === "outlet" ? "1 — Sales by outlet — click to drill in"
            : drillLevel === "brand" ? `${drillOutlet} — brands` : `${drillOutlet} · ${drillBrand} — products`}
          note={drillLoading ? "Loading…"
            : drillLevel === "outlet" ? `${d.byOutlet.length} outlets · click an outlet to see its brands`
            : drillLevel === "brand" ? "Click a brand to see its best-selling products"
            : `${drillItems.length} products · ${window.RM(drillTotal)}`}
          actions={
            <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, flexWrap: "wrap" }}>
              <button onClick={() => { setDrillOutlet(""); setDrillBrand(""); }}
                className="hoverable" style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: drillLevel === "outlet" ? 700 : 500, color: "var(--ink)" }}>
                All outlets
              </button>
              {drillOutlet && <><span style={{ color: "var(--stone)" }}>›</span>
                <button onClick={() => setDrillBrand("")} className="hoverable" style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: drillLevel === "brand" ? 700 : 500, color: "var(--ink)" }}>{drillOutlet}</button></>}
              {drillBrand && <><span style={{ color: "var(--stone)" }}>›</span>
                <span style={{ fontWeight: 700 }}>{drillBrand}</span></>}
            </div>
          }>
          {drillItems.length
            ? <BarList rows={drillItems.slice(0, 30)} labelKey="name"
                colorKey={drillLevel === "brand" ? "name" : undefined}
                onRowClick={drillLevel === "product" ? undefined : onDrillClick} />
            : <div style={{ padding: "24px", color: "var(--mute)", fontSize: 14 }}>{drillLoading ? "Loading…" : "Nothing here."}</div>}
        </Panel>

        <Panel title="3 — Product contribution to total sales" note={`Every product by share — ${d.contribution.length} in total`}>
          <Donut rows={d.contribution} />
        </Panel>

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
