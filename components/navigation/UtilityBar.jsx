import React from "react";

export function UtilityBar({ links = ["Find a Store", "Help", "Join Us", "Sign In"], left, style, ...rest }) {
  return (
    <div style={{ background: "var(--surface-utility-bar)", height: "var(--h-utility-bar)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 var(--container-gutter)", fontFamily: "var(--font-ui)", fontSize: "var(--caption-sm-size)", fontWeight: 500, color: "var(--ink)", ...style }} {...rest}>
      <div>{left}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
        {links.map((l, i) => (
          <React.Fragment key={l}>
            {i > 0 && <span style={{ color: "var(--stone)" }}>|</span>}
            <a href="#" style={{ color: "var(--ink)", textDecoration: "none" }}>{l}</a>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
