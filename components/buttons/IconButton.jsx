import React from "react";
import { Icon } from "../core/Icon.jsx";

export function IconButton({ name, label, size = 40, iconSize = 20, variant = "soft", style, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const fills = {
    soft: { background: "var(--soft-cloud)", color: "var(--ink)" },
    ghost: { background: "transparent", color: "var(--ink)" },
    onImage: { background: "var(--canvas)", color: "var(--ink)" },
    inverse: { background: "var(--ink)", color: "var(--canvas)" },
  };
  return (
    <button
      aria-label={label}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "var(--radius-icon-button)",
        cursor: "pointer",
        padding: 0,
        transition: "transform var(--duration-press) var(--ease-standard), opacity var(--duration-press) var(--ease-standard)",
        opacity: pressed ? "var(--press-opacity)" : 1,
        transform: pressed ? "scale(var(--press-scale))" : "scale(1)",
        ...fills[variant],
        ...style,
      }}
      {...rest}
    >
      <Icon name={name} size={iconSize} />
    </button>
  );
}
