import React from "react";

export function SwatchDot({ color = "var(--ink)", active = false, label, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      style={{
        width: active ? 20 : "var(--size-swatch-dot)",
        height: active ? 20 : "var(--size-swatch-dot)",
        padding: 0,
        borderRadius: "var(--radius-dot)",
        background: color,
        cursor: "pointer",
        boxShadow: active
          ? "0 0 0 2px var(--canvas) inset, 0 0 0 2px var(--ink)"
          : "0 0 0 1px var(--hairline)",
        border: "none",
        flex: "0 0 auto",
        ...style,
      }}
      {...rest}
    />
  );
}
