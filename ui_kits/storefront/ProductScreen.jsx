const { PhotoStage, SwatchDot, Button, IconButton, PriceRow, Badge, DisclosureRow, ProductCard } = window.SubtleGradientDesignSystem_21f929;

const SIZES = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];

function ProductScreen({ product, onAdded }) {
  const p = product || window.STOREFRONT.products[0];
  const [color, setColor] = React.useState(0);
  const [size, setSize] = React.useState(null);
  const [shot, setShot] = React.useState(0);
  const shots = ["Three-quarter", "Medial", "Lateral", "Top down", "Outsole", "On foot"];
  return (
    <Container style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-section)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 400px", gap: "var(--space-xl)", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {shots.map((s, i) => (
            <button key={s} onClick={() => setShot(i)} style={{ padding: 0, border: "none", background: "none", cursor: "pointer", boxShadow: i === shot ? "inset 0 0 0 1px var(--ink)" : "none" }}>
              <PhotoStage ratio="1/1" note={s} />
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <PhotoStage ratio="1/1" note={shots[shot] + " — product on soft-cloud studio"} />
          {p.badge && <span style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)" }}><Badge>{p.badge}</Badge></span>}
          <div style={{ position: "absolute", right: "var(--space-md)", bottom: "var(--space-md)", display: "flex", gap: "var(--space-sm)" }}>
            <IconButton name="chevron-left" label="Previous image" variant="onImage" />
            <IconButton name="chevron-right" label="Next image" variant="onImage" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
          <div>
            <h1 style={{ fontFamily: "var(--heading-family)", fontSize: "var(--heading-xl-size)", fontWeight: 500, lineHeight: "var(--heading-xl-lh)" }}>{p.name}</h1>
            <div style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)", marginTop: "var(--space-sm)" }}>{p.category}</div>
          </div>
          <PriceRow size="lg" price={p.price} wasPrice={p.wasPrice} discount={p.discount} />

          <div>
            <div style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)", marginBottom: "var(--space-sm)" }}>Select Colour</div>
            <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
              {(p.colors || ["#111111"]).map((c, i) => (
                <SwatchDot key={i} color={c} active={i === color} label={"Colorway " + (i + 1)} onClick={() => setColor(i)} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--caption-md-size)", fontWeight: 500, marginBottom: "var(--space-sm)" }}>
              <span style={{ color: "var(--mute)" }}>Select Size</span>
              <a href="#" style={{ color: "var(--ink)" }}>Size Guide</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-sm)" }}>
              {SIZES.map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{ height: 48, cursor: "pointer", background: "var(--canvas)", color: "var(--ink)", fontFamily: "var(--font-ui)", fontSize: "var(--button-md-size)", fontWeight: 500, borderRadius: "var(--radius-pill)", border: s === size ? "1px solid var(--ink)" : "var(--border-hairline)", boxShadow: s === size ? "inset 0 0 0 1px var(--ink)" : "none" }}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <Button fullWidth disabled={!size} onClick={() => onAdded && onAdded(p)}>{size ? "Add to Bag" : "Select a Size"}</Button>
            <Button fullWidth variant="secondary" iconLeft={<span style={{ display: "inline-flex" }}>♡</span>}>Favourite</Button>
          </div>

          <div style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-lh)", color: "var(--text-body)" }}>
            Built for wet rock and long descents. A 4mm lugged outsole holds the line on loose ground, and the waterproof membrane keeps the upper honest in weather.
          </div>
          <div style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--success)" }}>In stock — free standard delivery for members</div>

          <div>
            <DisclosureRow label="View Product Details" defaultOpen>
              Waterproof engineered mesh upper · 4mm multidirectional lugs · 8mm heel-toe offset · 285g (US 9)
            </DisclosureRow>
            <DisclosureRow label="Shipping & Returns">Free standard delivery on orders over $50. Returns accepted within 60 days.</DisclosureRow>
            <DisclosureRow label="Reviews (24)">Average 4.6 out of 5 across 24 reviews.</DisclosureRow>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-section)" }}>
        <SectionHead title="You Might Also Like" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap-grid)" }}>
          {window.STOREFRONT.products.slice(1, 5).map((x) => <ProductCard key={x.name} {...x} />)}
        </div>
      </div>
    </Container>
  );
}

Object.assign(window, { ProductScreen });
