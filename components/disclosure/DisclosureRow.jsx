import React from "react";
import { Icon } from "../core/Icon.jsx";

export function DisclosureRow({ label, children, variant = "detail", defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const isFaq = variant === "faq";
  return (
    <div style={{ borderBottom: "var(--border-hairline)", ...style }} {...rest}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-md)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "var(--pad-row) 0",
          textAlign: "left",
          color: "var(--ink)",
          fontFamily: isFaq ? "var(--heading-family)" : "var(--font-ui)",
          fontSize: "var(--body-md-size)",
          fontWeight: 500,
          lineHeight: isFaq ? "var(--heading-md-lh)" : "var(--body-md-lh)",
        }}
      >
        {label}
        <Icon name={open ? "chevron-up" : "chevron-down"} size={20} />
      </button>
      {open && children && (
        <div style={{ paddingBottom: "var(--pad-row)", fontSize: "var(--body-md-size)", fontWeight: 400, lineHeight: "var(--body-md-lh)", color: "var(--text-body)", maxWidth: "68ch" }}>{children}</div>
      )}
    </div>
  );
}
