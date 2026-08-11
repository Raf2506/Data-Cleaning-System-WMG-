import React from "react";
import { SearchPill } from "../forms/SearchPill.jsx";
import { IconButton } from "../buttons/IconButton.jsx";

export function PrimaryNav({ brand = "SUBTLE", items = [], active, onNavigate, style, ...rest }) {
  return (
    <nav style={{ background: "var(--canvas)", height: "var(--h-nav)", display: "flex", alignItems: "center", gap: "var(--space-xl)", padding: "0 var(--container-gutter)", ...style }} {...rest}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--ink)", flex: "0 0 auto" }}>{brand}</div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: "var(--space-xl)" }}>
        {items.map((it) => (
          <button
            key={it}
            onClick={() => onNavigate && onNavigate(it)}
            style={{
              background: "none",
              border: "none",
              padding: "0 0 2px",
              cursor: "pointer",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--body-md-size)",
              fontWeight: 500,
              color: "var(--ink)",
              borderBottom: it === active ? "2px solid var(--ink)" : "2px solid transparent",
            }}
          >
            {it}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", flex: "0 0 auto" }}>
        <SearchPill width={200} />
        <IconButton name="heart" label="Favourites" variant="ghost" />
        <IconButton name="shopping-bag" label="Bag" variant="ghost" />
      </div>
    </nav>
  );
}
