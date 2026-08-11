import React from "react";
import { PhotoStage } from "../media/PhotoStage.jsx";

export function CategoryIconCard({ label, image, imageNote, onClick, style, ...rest }) {
  return (
    <button onClick={onClick} style={{ background: "var(--surface-card)", border: "none", borderRadius: "var(--radius-none)", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-md)", ...style }} {...rest}>
      <div style={{ width: 96, height: 96 }}>
        <PhotoStage src={image} ratio="1/1" note={imageNote || label} />
      </div>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--ink)" }}>{label}</span>
    </button>
  );
}
