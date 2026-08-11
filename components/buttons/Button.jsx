import React from "react";

const SHARED = {
  fontFamily: "var(--font-ui)",
  fontWeight: 500,
  border: "none",
  borderRadius: "var(--radius-pill)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-sm)",
  cursor: "pointer",
  textDecoration: "none",
  transition: "transform var(--duration-press) var(--ease-standard), opacity var(--duration-press) var(--ease-standard)",
};

const VARIANTS = {
  primary: { background: "var(--action-primary-bg)", color: "var(--action-primary-fg)" },
  secondary: { background: "var(--action-secondary-bg)", color: "var(--action-secondary-fg)" },
  onImage: { background: "var(--action-on-image-bg)", color: "var(--action-on-image-fg)" },
};

const SIZES = {
  lg: { fontSize: "var(--button-lg-size)", lineHeight: "var(--button-lg-lh)", padding: "16px 32px", minHeight: 56, fontFamily: "var(--font-display-tuned)" },
  md: { fontSize: "var(--button-md-size)", lineHeight: "var(--button-md-lh)", padding: "var(--pad-pill-y) var(--pad-pill-x)", minHeight: "var(--h-pill)" },
  sm: { fontSize: "var(--button-sm-size)", lineHeight: "var(--button-sm-lh)", padding: "var(--pad-pill-compact-y) var(--pad-pill-compact-x)", minHeight: 40 },
};

export function Button({ children, variant = "primary", size = "md", disabled = false, fullWidth = false, iconLeft, iconRight, as = "button", style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const Tag = as;
  return (
    <Tag
      disabled={Tag === "button" ? disabled : undefined}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        ...SHARED,
        ...VARIANTS[variant],
        ...SIZES[size],
        width: fullWidth ? "100%" : undefined,
        opacity: disabled ? 0.4 : pressed ? "var(--press-opacity)" : 1,
        transform: pressed && !disabled ? "scale(var(--press-scale))" : "scale(1)",
        pointerEvents: disabled ? "none" : undefined,
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
