import React from "react";

export function FilterChip({ children, active = false, count, onClick, style, ...rest }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-xs)",
        height: "var(--h-chip)",
        padding: "var(--pad-chip-y) var(--pad-chip-x)",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--button-md-size)",
        fontWeight: 500,
        lineHeight: "var(--button-md-lh)",
        cursor: "pointer",
        background: active ? "var(--action-chip-active-bg)" : "var(--action-chip-bg)",
        color: active ? "var(--action-chip-active-fg)" : "var(--action-chip-fg)",
        border: active ? "1px solid var(--ink)" : "var(--border-hairline)",
        ...style,
      }}
      {...rest}
    >
      {children}
      {count != null && (
        <span style={{ color: active ? "var(--stone)" : "var(--mute)", fontSize: "var(--caption-sm-size)" }}>({count})</span>
      )}
    </button>
  );
}
