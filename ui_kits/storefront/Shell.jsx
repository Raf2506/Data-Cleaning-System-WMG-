const { UtilityBar, PrimaryNav, Footer } = window.SubtleGradientDesignSystem_21f929;

function Shell({ active, onNavigate, children }) {
  return (
    <div style={{ background: "var(--canvas)", minHeight: "100%" }}>
      <UtilityBar />
      <PrimaryNav brand="Subtle Gradient" items={window.STOREFRONT.nav} active={active} onNavigate={onNavigate} />
      <main>{children}</main>
      <Footer columns={window.STOREFRONT.footer} fineprint={window.STOREFRONT.fineprint} />
    </div>
  );
}

function SectionHead({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "var(--space-lg)" }}>
      <h2 style={{ fontFamily: "var(--heading-family)", fontSize: "var(--heading-xl-size)", fontWeight: 500, lineHeight: "var(--heading-xl-lh)" }}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "var(--link-md-size)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 2, color: "var(--ink)" }}>{action}</button>
      )}
    </div>
  );
}

function Container({ children, style }) {
  return <div style={{ width: "100%", maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-gutter)", ...style }}>{children}</div>;
}

Object.assign(window, { Shell, SectionHead, Container });
