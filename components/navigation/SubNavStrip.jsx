import React from "react";
import { Icon } from "../core/Icon.jsx";

export function SubNavStrip({ breadcrumb = [], sort = "Featured", filtersHidden = false, onToggleFilters, style, ...rest }) {
  return (
    <div style={{ background: "var(--canvas)", boxShadow: "var(--elevation-2)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md) var(--container-gutter)", ...style }} {...rest}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)" }}>
        {breadcrumb.join(" / ")}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
        <button onClick={onToggleFilters} style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "var(--button-md-size)", fontWeight: 500, color: "var(--ink)" }}>
          {filtersHidden ? "Show Filters" : "Hide Filters"}
          <Icon name="sliders-horizontal" size={18} />
        </button>
        <button style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "var(--button-md-size)", fontWeight: 500, color: "var(--ink)" }}>
          Sort By: {sort}
          <Icon name="chevron-down" size={18} />
        </button>
      </div>
    </div>
  );
}
