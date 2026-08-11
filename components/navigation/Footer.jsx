import React from "react";

export function Footer({ columns = [], fineprint = [], style, ...rest }) {
  return (
    <footer style={{ background: "var(--canvas)", borderTop: "var(--border-hairline)", padding: "var(--space-section) var(--container-gutter) var(--space-xl)", ...style }} {...rest}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(" + Math.max(columns.length, 1) + ", 1fr)", gap: "var(--space-xl)" }}>
        {columns.map((c) => (
          <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--body-md-size)", fontWeight: 500, color: "var(--ink)" }}>{c.title}</div>
            {c.links.map((l) => (
              <a key={l} href="#" style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "var(--border-hairline)", marginTop: "var(--space-section)", paddingTop: "var(--space-lg)", display: "flex", gap: "var(--space-lg)", flexWrap: "wrap", fontSize: "var(--utility-xs-size)", lineHeight: "var(--utility-xs-lh)", fontWeight: 500, color: "var(--mute)" }}>
        {fineprint.map((f) => <span key={f}>{f}</span>)}
      </div>
    </footer>
  );
}
