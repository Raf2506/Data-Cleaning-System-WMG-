const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function ReportsScreen() {
  const d = window.INVOICE;
  const live = window.API.live;

  // Drill-down: store -> branch -> brand -> product, one level per click.
  const [drillStore, setDrillStore] = React.useState("");
  const [drillOutlet, setDrillOutlet] = React.useState("");
  const [drillBrand, setDrillBrand] = React.useState("");
  const [drillItems, setDrillItems] = React.useState((d.byStore || []).map((o) => ({ name: o.store, amount: o.amount })));
  const [drillLoading, setDrillLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    // Top level (no store selected) is the store list already in memory.
    if (!drillStore) { setDrillItems((d.byStore || []).map((o) => ({ name: o.store, amount: o.amount }))); return; }
    if (!live) return;
    setDrillLoading(true);
    window.API.breakdown({ group: drillStore, outlet: drillOutlet || undefined, brand: drillBrand || undefined })
      .then((res) => { if (!cancelled) setDrillItems(res.items); })
      .catch(() => !cancelled && setDrillItems([]))
      .finally(() => !cancelled && setDrillLoading(false));
    return () => { cancelled = true; };
  }, [drillStore, drillOutlet, drillBrand, live]);

  // Clicking a bar drills one level deeper; the breadcrumb steps back out.
  const onDrillClick = (row) => {
    if (!drillStore) setDrillStore(row.name);
    else if (!drillOutlet) setDrillOutlet(row.name);
    else if (!drillBrand) setDrillBrand(row.name);
    // At product level there is nowhere deeper to go.
  };
  const drillLevel = !drillStore ? "store" : !drillOutlet ? "branch" : !drillBrand ? "brand" : "product";
  const drillTotal = drillItems.reduce((a, r) => a + r.amount, 0);

  const topStore = (d.byStore && d.byStore[0]) || { store: "—", amount: 0 };
  const bestProduct = (d.stats.bestProduct && d.stats.bestProduct.name)
    ? d.stats.bestProduct
    : (d.contribution[0] ? { name: d.contribution[0].product, amount: d.contribution[0].amount } : { name: "—", amount: 0 });
  const bestMonth = window.bestMonth(d);
  const share = d.stats.totalSales ? (bestProduct.amount / d.stats.totalSales) * 100 : 0;
  const perMonth = window.bestStoreByMonth(d);

  const stores = d.byStore || [];
  const storeShare = d.stats.totalSales ? (topStore.amount / d.stats.totalSales) * 100 : 0;
  const topThreeShare = d.stats.totalSales
    ? (stores.slice(0, 3).reduce((a, r) => a + r.amount, 0) / d.stats.totalSales) * 100
    : 0;

  const monthly = d.monthly || [];
  const worstMonth = monthly.length
    ? monthly.reduce((a, m) => (a && a.amount <= m.amount ? a : m), null)
    : null;

  return (
    <div>
      {/* Paper header — only appears in the PDF, where the sidebar is hidden. */}
      <div className="print-only print-header">
        <h1>{`Sales overview · ${d.stats.period || ""}`}</h1>
        <div className="meta">
          Clean Sight<br />
          {`${d.stats.invoices.toLocaleString()} invoices · ${d.stats.lineItems.toLocaleString()} line items`}<br />
          {`Generated ${new Date().toLocaleDateString()}`}
        </div>
      </div>

      {/* Hidden on paper: the print header above already carries the title. */}
      <div className="no-print">
        <PageHead kicker={`Yearly overview · ${d.stats.period || "—"}`} title="Reports"
          actions={<>
            <GhostButton icon="download" href={live ? window.API.exportUrl("csv") : null} disabled={!live}>CSV</GhostButton>
            <GhostButton icon="download" href={live ? window.API.exportUrl("xlsx") : null} disabled={!live}>XLSX</GhostButton>
            <Button size="sm" iconLeft={<Icon name="file-down" size={16} />} onClick={() => window.print()}>Download PDF</Button>
          </>} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
        <StatCard tone="ink" label="Total sales, period" value={window.RMk(d.stats.totalSales)} sub={d.stats.period} />
        <StatCard tone="#0a7281" label="Best-selling store" value={topStore.store} sub={window.RM(topStore.amount)} />
        <StatCard tone="#7c3aed" label="Best-selling product" value={bestProduct.name}
          sub={`${window.RM(bestProduct.amount)} · ${share.toFixed(1)}% of total`} />
        <StatCard tone="#2563eb" label="Best month" value={bestMonth.label} sub={window.RM(bestMonth.amount)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Panel
          title={drillLevel === "store" ? "1 — Sales by store — click to drill in"
            : drillLevel === "branch" ? `${drillStore} — branches`
            : drillLevel === "brand" ? `${drillStore} · ${drillOutlet} — brands`
            : `${drillOutlet} · ${drillBrand} — products`}
          note={drillLoading ? "Loading…"
            : drillLevel === "store" ? `${(d.byStore || []).length} stores · click a store to see its branches`
            : drillLevel === "branch" ? "Click a branch to see its brands"
            : drillLevel === "brand" ? "Click a brand to see its best-selling products"
            : `${drillItems.length} products · ${window.RM(drillTotal)}`}
          actions={
            <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, flexWrap: "wrap" }}>
              <Crumb onClick={() => { setDrillStore(""); setDrillOutlet(""); setDrillBrand(""); }} active={drillLevel === "store"}>All stores</Crumb>
              {drillStore && <><Sep /><Crumb onClick={() => { setDrillOutlet(""); setDrillBrand(""); }} active={drillLevel === "branch"}>{drillStore}</Crumb></>}
              {drillOutlet && <><Sep /><Crumb onClick={() => setDrillBrand("")} active={drillLevel === "brand"}>{drillOutlet}</Crumb></>}
              {drillBrand && <><Sep /><span style={{ fontWeight: 700 }}>{drillBrand}</span></>}
            </div>
          }>
          {drillItems.length
            ? <BarList rows={drillItems.slice(0, 30)} labelKey="name"
                colorKey={drillLevel === "store" || drillLevel === "brand" ? "name" : undefined}
                onRowClick={drillLevel === "product" ? undefined : onDrillClick} />
            : <div style={{ padding: "24px", color: "var(--mute)", fontSize: 14 }}>{drillLoading ? "Loading…" : "Nothing here."}</div>}
          {/* Notes describe the store ranking, so only print them at that level. */}
          {drillLevel === "store" && (
            <Notes title="Graph notes — sales by store" items={[
              topStore.store !== "—" && `${topStore.store} is the strongest store at ${window.RM(topStore.amount)}, ${storeShare.toFixed(1)}% of total sales.`,
              stores.length > 1 && `${stores.length} stores contributed in this period; the top three make up ${topThreeShare.toFixed(1)}% of sales.`,
              stores.length > 3 && `The remaining ${stores.length - 3} stores together account for ${(100 - topThreeShare).toFixed(1)}% of sales.`,
            ]} />
          )}
        </Panel>

        {monthly.length > 1 && (
          <div className="printbreak">
          <Panel title="2 — Monthly sales, company-wide" note="Computed from the uploaded range — not a fixed calendar">
            <ColumnChart rows={monthly} />
            <Notes title="Graph notes — monthly sales" items={[
              bestMonth.label !== "—" && `Sales peaked in ${bestMonth.label} at ${window.RM(bestMonth.amount)}, the strongest buying period.`,
              worstMonth && `${window.monthLabel(worstMonth.month)} was the lowest at ${window.RM(worstMonth.amount)} — worth watching ordering movement around it.`,
              `Average per month is ${window.RM(d.stats.totalSales / monthly.length)} across ${monthly.length} months.`,
            ]} />
          </Panel>
          </div>
        )}

        <div className="printbreak">
        <Panel title="3 — Product contribution to total sales" note={`Every product by share — ${d.contribution.length} in total`}>
          <Donut rows={d.contribution} />
          <Notes title="Graph notes — product mix" items={[
            bestProduct.name !== "—" && `${bestProduct.name} leads at ${window.RM(bestProduct.amount)}, ${share.toFixed(1)}% of total sales.`,
            (d.brandPie || []).length > 0 && `Brand mix: ${(d.brandPie || []).slice(0, 3).map((b) => `${b.product} ${((b.amount / (d.stats.totalSales || 1)) * 100).toFixed(1)}%`).join(", ")}.`,
            `${d.contribution.length} distinct products sold in this period.`,
          ]} />
        </Panel>
        </div>

        {perMonth.length > 0 && (
          <Panel title="Best-selling store per month">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {perMonth.map((r) => (
                <div key={r.label} style={{ background: "var(--soft-cloud)", padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>{r.store}</div>
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

/** Power BI style "graph notes" — rendered only into the PDF. */
function Notes({ title, items }) {
  const lines = (items || []).filter(Boolean);
  if (!lines.length) return null;
  return (
    <div className="print-only notes">
      <h4>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {lines.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}

function Crumb({ onClick, active, children }) {
  return (
    <button onClick={onClick} className="hoverable"
      style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: active ? 700 : 500, color: "var(--ink)" }}>
      {children}
    </button>
  );
}

function Sep() {
  return <span style={{ color: "var(--stone)" }}>›</span>;
}

Object.assign(window, { ReportsScreen });
