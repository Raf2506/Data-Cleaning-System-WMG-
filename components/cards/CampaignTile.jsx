import React from "react";
import { PhotoStage } from "../media/PhotoStage.jsx";
import { Button } from "../buttons/Button.jsx";

export function CampaignTile({ headline, eyebrow, cta, ratio = "16/9", image, imageNote, headlineColor = "var(--canvas)", size = 96, align = "bottom", tone = "ink", style, ...rest }) {
  return (
    <div style={{ position: "relative", borderRadius: "var(--radius-tile)", overflow: "hidden", ...style }} {...rest}>
      <PhotoStage src={image} ratio={ratio} note={imageNote || "Campaign photography"} tone={tone} />
      <div style={{ position: "absolute", left: "var(--space-xl)", right: "var(--space-xl)", top: align === "top" ? "var(--space-xl)" : undefined, bottom: align === "bottom" ? "var(--space-xl)" : undefined, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--space-lg)" }}>
        {eyebrow && <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--caption-md-size)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: headlineColor }}>{eyebrow}</div>}
        {headline && (
          <div style={{ fontFamily: "var(--font-display)", fontSize: size, lineHeight: "var(--display-campaign-lh)", textTransform: "uppercase", color: headlineColor, letterSpacing: 0, maxWidth: "14ch" }}>{headline}</div>
        )}
        {cta && <Button variant="onImage">{cta}</Button>}
      </div>
    </div>
  );
}
