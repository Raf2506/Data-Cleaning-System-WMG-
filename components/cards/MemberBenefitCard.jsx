import React from "react";
import { PhotoStage } from "../media/PhotoStage.jsx";
import { Button } from "../buttons/Button.jsx";

export function MemberBenefitCard({ headline, cta = "Explore", ratio = "4/5", image, imageNote, tone = "ink", style, ...rest }) {
  return (
    <div style={{ position: "relative", borderRadius: "var(--radius-tile)", overflow: "hidden", ...style }} {...rest}>
      <PhotoStage src={image} ratio={ratio} note={imageNote || headline} tone={tone} />
      <div style={{ position: "absolute", left: "var(--space-xl)", right: "var(--space-xl)", bottom: "var(--space-xl)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--space-lg)" }}>
        <div style={{ fontFamily: "var(--heading-family)", fontSize: "var(--heading-lg-size)", fontWeight: 500, lineHeight: "var(--heading-lg-lh)", color: "var(--text-inverse)", maxWidth: "18ch" }}>{headline}</div>
        {cta && <Button variant="onImage">{cta}</Button>}
      </div>
    </div>
  );
}
