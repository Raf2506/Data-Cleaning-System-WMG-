const { CampaignTile, ProductCard, CategoryIconCard, PhotoStage, Button, IconButton } = window.SubtleGradientDesignSystem_21f929;

function HomeScreen({ onOpenListing, onOpenProduct }) {
  const d = window.STOREFRONT;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-section)", paddingBottom: "var(--space-section)" }}>
      <CampaignTile ratio="16/9" eyebrow="Trail Collection" headline="Hold the line" cta="Shop Trail" imageNote="Full-bleed campaign photography — runner on exposed ridge" />

      <Container>
        <SectionHead title="Trending Now" action="Shop All" onAction={onOpenListing} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap-grid)" }}>
          {d.products.slice(0, 4).map((p) => (
            <ProductCard key={p.name} {...p} onClick={() => onOpenProduct(p)} />
          ))}
        </div>
      </Container>

      <Container>
        <SectionHead title="Shop by Sport" />
        <div style={{ display: "flex", gap: "var(--gap-grid)", overflowX: "auto" }}>
          {d.sports.map((s) => (
            <div key={s.label} style={{ flex: "0 0 240px", position: "relative" }}>
              <PhotoStage ratio="4/5" note={s.note} tone="ink" />
              <div style={{ position: "absolute", left: "var(--space-lg)", bottom: "var(--space-lg)" }}>
                <Button variant="onImage" size="sm" onClick={onOpenListing}>{s.label}</Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap-grid)" }}>
          <CampaignTile ratio="4/5" headline="Pace" size={64} cta="Shop Road" imageNote="Editorial: road session, cool grade" tone="ink" />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-grid)" }}>
            <PhotoStage ratio="16/9" note="Product still life — spike plate detail" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap-grid)" }}>
              {d.products.slice(4, 6).map((p) => <ProductCard key={p.name} {...p} onClick={() => onOpenProduct(p)} />)}
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <SectionHead title="Latest in Clothing" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "var(--gap-grid)" }}>
          {d.categories.map((c) => <CategoryIconCard key={c} label={c} imageNote={c} onClick={onOpenListing} />)}
        </div>
      </Container>
    </div>
  );
}

Object.assign(window, { HomeScreen });
