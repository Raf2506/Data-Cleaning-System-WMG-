import React from "react";
import { Icon } from "../core/Icon.jsx";

export function SearchPill({ placeholder = "Search", value, onChange, width = 240, style, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-sm)",
        height: "var(--h-search)",
        width,
        padding: "var(--space-sm) var(--space-md)",
        borderRadius: "var(--radius-search)",
        background: focused ? "var(--canvas)" : "var(--soft-cloud)",
        border: focused ? "var(--focus-border)" : "2px solid transparent",
        boxShadow: focused ? "var(--focus-ring)" : "none",
        color: "var(--ink)",
        ...style,
      }}
    >
      <Icon name="search" size={18} color="var(--ink)" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          fontSize: "var(--body-md-size)",
          color: "var(--ink)",
          width: "100%",
        }}
        {...rest}
      />
    </div>
  );
}
