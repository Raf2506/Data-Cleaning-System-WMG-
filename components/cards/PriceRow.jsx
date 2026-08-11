import React from "react";

export function PriceRow({ price, wasPrice, discount, size = "md", style, ...rest }) {
  const fs = size === "lg" ? "var(--heading-lg-size)" : "var(--body-md-size)";
  const onSale = wasPrice != null;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-sm)", fontFamily: "var(--font-ui)", fontSize: fs, fontWeight: 500, lineHeight: "var(--body-md-lh)", ...style }} {...rest}>
      <span style={{ color: onSale ? "var(--text-price-sale)" : "var(--ink)" }}>{price}</span>
      {onSale && <span style={{ color: "var(--text-price-was)", textDecoration: "line-through" }}>{wasPrice}</span>}
      {onSale && discount && <span style={{ color: "var(--text-price-sale)", fontSize: "var(--caption-md-size)" }}>{discount}</span>}
    </div>
  );
}
