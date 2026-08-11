import React from "react";

export function Badge({ children, style, ...rest }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: "var(--radius-pill)",
        background: "var(--canvas)",
        color: "var(--ink)",
        border: "var(--border-hairline)",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--caption-sm-size)",
        fontWeight: 500,
        lineHeight: "var(--caption-sm-lh)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
