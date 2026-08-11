const { SubNavStrip, FilterSidebar, FilterChip, ProductCard } = window.SubtleGradientDesignSystem_21f929;

function ListingScreen({ onOpenProduct }) {
  const d = window.STOREFRONT;
  const [hidden, setHidden] = React.useState(false);
  const [selected, setSelected] = React.useState(["Trail"]);
  const toggle = (l) => setSelected((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));
  return (
    <div>
      <SubNavStrip breadcrumb={["Men", "Shoes", "Trail Running"]} filtersHidden={hidden} onToggleFilters={() => setHidden(!hidden)} sort="Featured" />
      <Container style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-section)" }}>
        <div style={{ display: "flex", gap: "var(--space-section)" }}>
          {!hidden && <FilterSidebar groups={d.filters} selected={selected} onToggle={toggle} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
              <h1 style={{ fontFamily: "var(--heading-family)", fontSize: "var(--heading-xl-size)", fontWeight: 500 }}>Men's Trail Running Shoes</h1>
              <span style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)" }}>{d.products.length} Results</span>
            </div>
            {selected.length > 0 && (
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
                {selected.map((s) => <FilterChip key={s} active onClick={() => toggle(s)}>{s} ✕</FilterChip>)}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap-grid)" }}>
              {d.products.map((p) => <ProductCard key={p.name} {...p} onClick={() => onOpenProduct(p)} />)}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

Object.assign(window, { ListingScreen });
