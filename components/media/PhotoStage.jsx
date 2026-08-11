import React from "react";

/* The stage every photograph sits on. With `src` it renders the image
   full-bleed at the given ratio; without one it renders the soft-cloud
   studio backdrop plus a caption naming the shot that belongs there —
   the source kit shipped no photography. */
export function PhotoStage({ src, alt = "", ratio = "1/1", note, tone = "soft", children, style, ...rest }) {
  const tones = { soft: "var(--soft-cloud)", ink: "var(--ink)", pale: "var(--accent-purple-pale)" };
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, background: tones[tone] || tone, overflow: "hidden", ...style }} {...rest}>
      {src ? (
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xl)", textAlign: "center", fontSize: "var(--caption-sm-size)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: tone === "ink" ? "var(--stone)" : "var(--mute)" }}>
          {note || "Photography"}
        </span>
      )}
      {children}
    </div>
  );
}
