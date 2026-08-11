import React from "react";

/* Lucide icon wrapper. The source kit shipped no icon assets, so Lucide
   (MIT, 2px stroke, round caps) stands in — see readme.md → Iconography.
   Requires the Lucide UMD script on the page; the wrapper re-runs
   createIcons() whenever the rendered name changes. */
export function Icon({ name, size = 20, color = "currentColor", strokeWidth = 2, style, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = "";
    const holder = document.createElement("i");
    holder.setAttribute("data-lucide", name);
    el.appendChild(holder);
    window.lucide.createIcons({
      nameAttr: "data-lucide",
      attrs: { width: size, height: size, stroke: color, "stroke-width": strokeWidth },
      root: el,
    });
  }, [name, size, color, strokeWidth]);
  return <span ref={ref} aria-hidden="true" style={{ display: "inline-flex", width: size, height: size, flex: "0 0 auto", ...style }} {...rest} />;
}
