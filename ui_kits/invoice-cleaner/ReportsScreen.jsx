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

  const stores = d.byStore || [];
  const storeShare = d.stats.totalSales ? (topStore.amount / d.stats.totalSales) * 100 : 0;
  const topThreeShare = d.stats.totalSales
    ? (stores.slice(0, 3).reduce((a, r) => a + r.amount, 0) / d.stats.totalSales) * 100
    : 0;

  const uomMix = d.uomMix || [];
  const brandRanking = d.brandRanking || [];
  const topPerMonth = d.topStoresPerMonth || [];
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
            <GhostButton icon="table-2" href={live ? window.API.exportUrl("report") : null} disabled={!live}
              title="Summary, index and one sheet per store">Cleaned XLSX</GhostButton>
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

        {uomMix.length > 0 && (
          <Panel title="3 — How it was sold — unit of measure"
            note="Quantities in different units are never added together">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(" + Math.min(uomMix.length, 4) + ", 1fr)", gap: 8 }}>
              {uomMix.map((u) => (
                <div key={u.bucket} style={{ background: "var(--soft-cloud)", padding: "16px 18px", borderLeft: "4px solid " + window.colorFor(u.bucket) }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>
                    {UOM_TITLES[u.bucket] || u.bucket}
                  </div>
                  <div style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 30, lineHeight: 1.05, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
                    {u.quantity.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{window.RM(u.amount)}</div>
                  <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 2 }}>
                    {u.lines.toLocaleString()} lines · {u.codes.join(", ")}
                  </div>
                </div>
              ))}
            </div>
            <Notes title="Graph notes — unit of measure" items={uomMix.map((u) =>
              u.quantity.toLocaleString() + " " + (UOM_TITLES[u.bucket] || u.bucket).toLowerCase()
                + " over " + u.lines.toLocaleString() + " lines, " + window.RM(u.amount)
                + " (" + u.codes.join(", ") + ")."
            )} />
          </Panel>
        )}

        <div className="printbreak">
        <Panel title="4 — Product contribution to total sales" note={`Every product by share — ${d.contribution.length} in total`}>
          <Donut rows={d.contribution} />
          <Notes title="Graph notes — product mix" items={[
            bestProduct.name !== "—" && `${bestProduct.name} leads at ${window.RM(bestProduct.amount)}, ${share.toFixed(1)}% of total sales.`,
            (d.brandPie || []).length > 0 && `Brand mix: ${(d.brandPie || []).slice(0, 3).map((b) => `${b.product} ${((b.amount / (d.stats.totalSales || 1)) * 100).toFixed(1)}%`).join(", ")}.`,
            `${d.contribution.length} distinct products sold in this period.`,
          ]} />
        </Panel>
        </div>

        {topPerMonth.length > 0 && (
          <Panel title="Top 5 best-selling stores per month"
            note="Ranked within each month, with each store's share of that month">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(" + Math.min(topPerMonth.length, 3) + ", 1fr)", gap: 8 }}>
              {topPerMonth.map((m) => (
                <div key={m.month} style={{ border: "1px solid var(--hairline)" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>{window.monthLabel(m.month)}</span>
                    <span style={{ fontSize: 12, color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{window.RMk(m.total)}</span>
                  </div>
                  {m.stores.map((r, i) => (
                    <div key={r.store} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: "1px solid var(--hairline-soft)" }}>
                      <span style={{ flex: "0 0 18px", fontSize: 12, fontWeight: 700, color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                      <span style={{ width: 10, height: 10, flex: "0 0 auto", background: window.colorFor(r.store) }} />
                      <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.store}>{r.store}</span>
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--mute)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{window.RM(r.amount)}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, width: 46, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(r.share * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {brandRanking.length > 0 && (
          <Panel title="Brands, best to worst"
            note={"All " + brandRanking.length + " brands by sales value, with how each was sold"}>
            <div style={{ overflowX: "auto" }}>
              <table className="grid" style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
                <thead><tr>
                  <th style={brandTh}>#</th>
                  <th style={brandTh}>Brand</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Sales</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Share</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Cartons</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Units</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Pieces</th>
                  <th style={{ ...brandTh, textAlign: "right" }}>Other</th>
                </tr></thead>
                <tbody>
                  {brandRanking.map((b, i) => (
                    <tr key={b.brand}>
                      <td style={{ ...brandTd, color: "var(--mute)", fontWeight: 700, width: 34 }}>{i + 1}</td>
                      <td style={brandTd}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                          <span style={{ width: 10, height: 10, background: window.colorFor(b.brand) }} />
                          <span style={{ fontWeight: i === 0 ? 700 : 600 }}>{b.brand}</span>
                        </span>
                      </td>
                      <td style={brandNum}>{window.RM(b.amount)}</td>
                      <td style={{ ...brandNum, fontWeight: 600 }}>{(b.share * 100).toFixed(1)}%</td>
                      <td style={brandNum}>{b.carton ? b.carton.toLocaleString() : "—"}</td>
                      <td style={brandNum}>{b.unit ? b.unit.toLocaleString() : "—"}</td>
                      <td style={brandNum}>{b.pcs ? b.pcs.toLocaleString() : "—"}</td>
                      <td style={brandNum}>{b.other ? b.other.toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Notes title="Graph notes — brands" items={[
              brandRanking.length > 0 && brandRanking[0].brand + " leads with " + window.RM(brandRanking[0].amount)
                + ", " + (brandRanking[0].share * 100).toFixed(1) + "% of sales.",
              brandRanking.length > 1 && "Weakest is " + brandRanking[brandRanking.length - 1].brand
                + " at " + window.RM(brandRanking[brandRanking.length - 1].amount) + ".",
              brandRanking.length > 2 && "The top three take "
                + (brandRanking.slice(0, 3).reduce((a, b) => a + b.share, 0) * 100).toFixed(1) + "% of total sales.",
            ]} />
          </Panel>
        )}

      </div>
    </div>
  );
}

// The four quantity buckets, in the words a reader expects.
const UOM_TITLES = { CARTON: "Cartons", UNIT: "Units", PCS: "Pieces", OTHER: "Other units" };

const brandTh = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 14px", borderBottom: "1px solid var(--ink)", whiteSpace: "nowrap" };
const brandTd = { padding: "10px 14px", fontSize: 13, verticalAlign: "middle" };
const brandNum = { ...brandTd, textAlign: "right", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };

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
