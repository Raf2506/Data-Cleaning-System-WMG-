import React from "react";
import { PhotoStage } from "../media/PhotoStage.jsx";
import { SwatchDot } from "../forms/SwatchDot.jsx";
import { Badge } from "./Badge.jsx";
import { PriceRow } from "./PriceRow.jsx";

export function ProductCard({ name, category, price, wasPrice, discount, badge, colors = [], colorCount, image, imageNote, ratio = "1/1", onClick, style, ...rest }) {
  const [selected, setSelected] = React.useState(0);
  return (
    <div onClick={onClick} style={{ background: "var(--surface-card)", borderRadius: "var(--radius-card)", padding: 0, cursor: onClick ? "pointer" : "default", ...style }} {...rest}>
      <PhotoStage src={image} note={imageNote || name} ratio={ratio} alt={name}>
        {badge && <span style={{ position: "absolute", top: "var(--space-md)", left: "var(--space-md)" }}><Badge>{badge}</Badge></span>}
      </PhotoStage>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-card-meta)", paddingTop: "var(--space-md)" }}>
        {colors.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            {colors.map((c, i) => (
              <SwatchDot key={i} color={c} active={i === selected} label={"Colorway " + (i + 1)} onClick={(e) => setSelected(i)} />
            ))}
          </div>
        )}
        <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--body-md-size)", fontWeight: 500, lineHeight: "var(--body-md-lh)", color: "var(--ink)" }}>{name}</div>
        {category && <div style={{ fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--mute)" }}>{category}</div>}
        {colorCount && <div style={{ fontSize: "var(--caption-sm-size)", fontWeight: 500, color: "var(--mute)" }}>{colorCount}</div>}
        <PriceRow price={price} wasPrice={wasPrice} discount={discount} />
      </div>
    </div>
  );
}
