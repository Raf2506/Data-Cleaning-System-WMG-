const { CampaignTile, MemberBenefitCard, DisclosureRow, Button } = window.SubtleGradientDesignSystem_21f929;

function MembershipScreen() {
  const benefits = [
    "Member-only products",
    "Free delivery, every order",
    "Exclusive access to events",
  ];
  const faqs = [
    "How do I become a member?",
    "Is membership free?",
    "What are member rewards?",
    "How do I cancel my membership?",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-section)", paddingBottom: "var(--space-section)" }}>
      <CampaignTile ratio="16/9" eyebrow="Membership" headline="Become a member" cta="Join Us" imageNote="Membership campaign — group run, dusk" />
      <Container>
        <SectionHead title="Member Benefits" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap-grid)" }}>
          {benefits.map((b) => <MemberBenefitCard key={b} headline={b} imageNote={b} />)}
        </div>
      </Container>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-section)", alignItems: "start" }}>
          <div>
            <SectionHead title="Frequently Asked Questions" />
            {faqs.map((f) => (
              <DisclosureRow key={f} label={f} variant="faq">
                Membership is free. Join online or in the app and your benefits apply to your next order.
              </DisclosureRow>
            ))}
          </div>
          <div style={{ background: "var(--soft-cloud)", padding: "var(--space-section)", display: "flex", flexDirection: "column", gap: "var(--space-lg)", alignItems: "flex-start" }}>
            <div style={{ fontFamily: "var(--heading-family)", fontSize: "var(--heading-lg-size)", fontWeight: 500, lineHeight: "var(--heading-lg-lh)", maxWidth: "22ch" }}>
              Join free and get first access to new arrivals.
            </div>
            <div style={{ fontSize: "var(--body-md-size)", color: "var(--text-body)", maxWidth: "44ch" }}>
              Members get free delivery on every order, member-only products, and entry to local run events.
            </div>
            <Button>Join Us</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

Object.assign(window, { MembershipScreen });
