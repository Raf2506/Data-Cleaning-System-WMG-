/* @ds-bundle: {"format":4,"namespace":"SubtleGradientDesignSystem_21f929","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"FilterChip","sourcePath":"components/buttons/FilterChip.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/cards/Badge.jsx"},{"name":"CampaignTile","sourcePath":"components/cards/CampaignTile.jsx"},{"name":"CategoryIconCard","sourcePath":"components/cards/CategoryIconCard.jsx"},{"name":"MemberBenefitCard","sourcePath":"components/cards/MemberBenefitCard.jsx"},{"name":"PriceRow","sourcePath":"components/cards/PriceRow.jsx"},{"name":"ProductCard","sourcePath":"components/cards/ProductCard.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"DisclosureRow","sourcePath":"components/disclosure/DisclosureRow.jsx"},{"name":"SearchPill","sourcePath":"components/forms/SearchPill.jsx"},{"name":"SwatchDot","sourcePath":"components/forms/SwatchDot.jsx"},{"name":"PhotoStage","sourcePath":"components/media/PhotoStage.jsx"},{"name":"FilterSidebar","sourcePath":"components/navigation/FilterSidebar.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"PrimaryNav","sourcePath":"components/navigation/PrimaryNav.jsx"},{"name":"SubNavStrip","sourcePath":"components/navigation/SubNavStrip.jsx"},{"name":"UtilityBar","sourcePath":"components/navigation/UtilityBar.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"b7e3847b3df1","components/buttons/FilterChip.jsx":"4ff36ea66d06","components/buttons/IconButton.jsx":"119318918666","components/cards/Badge.jsx":"f15a41eeec3d","components/cards/CampaignTile.jsx":"0d36934a9a77","components/cards/CategoryIconCard.jsx":"ac8e24d23053","components/cards/MemberBenefitCard.jsx":"34dd054d9004","components/cards/PriceRow.jsx":"9d8c966bb0ae","components/cards/ProductCard.jsx":"34271208db71","components/core/Icon.jsx":"2da47f444c6f","components/disclosure/DisclosureRow.jsx":"046a61b988ff","components/forms/SearchPill.jsx":"91f387f0810f","components/forms/SwatchDot.jsx":"e063d2da9532","components/media/PhotoStage.jsx":"53df0ea34579","components/navigation/FilterSidebar.jsx":"495df0222bd3","components/navigation/Footer.jsx":"2cc05d93ffe0","components/navigation/PrimaryNav.jsx":"6321173f9fde","components/navigation/SubNavStrip.jsx":"f0824af86f19","components/navigation/UtilityBar.jsx":"c1a369bb7530","ui_kits/invoice-cleaner/AppChrome.jsx":"2ad2bbf35d75","ui_kits/invoice-cleaner/Charts.jsx":"c76d57ca3991","ui_kits/invoice-cleaner/DashboardScreen.jsx":"c88773df1e61","ui_kits/invoice-cleaner/MappingScreen.jsx":"da8cf1642d2a","ui_kits/invoice-cleaner/ReportsScreen.jsx":"998112b745cd","ui_kits/invoice-cleaner/TableScreen.jsx":"5a84d26aa32e","ui_kits/invoice-cleaner/UploadScreen.jsx":"2b9a3c386c63","ui_kits/invoice-cleaner/data.js":"6867fc8bd628","ui_kits/storefront/HomeScreen.jsx":"8ae2872ce56e","ui_kits/storefront/ListingScreen.jsx":"2fa027faf68c","ui_kits/storefront/MembershipScreen.jsx":"171915a4e7a5","ui_kits/storefront/ProductScreen.jsx":"a6fcf6b553b4","ui_kits/storefront/Shell.jsx":"b8769f9a1660","ui_kits/storefront/data.js":"23f0d3e5c033"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SubtleGradientDesignSystem_21f929 = window.SubtleGradientDesignSystem_21f929 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  transition: "transform var(--duration-press) var(--ease-standard), opacity var(--duration-press) var(--ease-standard)"
};
const VARIANTS = {
  primary: {
    background: "var(--action-primary-bg)",
    color: "var(--action-primary-fg)"
  },
  secondary: {
    background: "var(--action-secondary-bg)",
    color: "var(--action-secondary-fg)"
  },
  onImage: {
    background: "var(--action-on-image-bg)",
    color: "var(--action-on-image-fg)"
  }
};
const SIZES = {
  lg: {
    fontSize: "var(--button-lg-size)",
    lineHeight: "var(--button-lg-lh)",
    padding: "16px 32px",
    minHeight: 56,
    fontFamily: "var(--font-display-tuned)"
  },
  md: {
    fontSize: "var(--button-md-size)",
    lineHeight: "var(--button-md-lh)",
    padding: "var(--pad-pill-y) var(--pad-pill-x)",
    minHeight: "var(--h-pill)"
  },
  sm: {
    fontSize: "var(--button-sm-size)",
    lineHeight: "var(--button-sm-lh)",
    padding: "var(--pad-pill-compact-y) var(--pad-pill-compact-x)",
    minHeight: 40
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  as = "button",
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: Tag === "button" ? disabled : undefined,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
      ...SHARED,
      ...VARIANTS[variant],
      ...SIZES[size],
      width: fullWidth ? "100%" : undefined,
      opacity: disabled ? 0.4 : pressed ? "var(--press-opacity)" : 1,
      transform: pressed && !disabled ? "scale(var(--press-scale))" : "scale(1)",
      pointerEvents: disabled ? "none" : undefined,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/FilterChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FilterChip({
  children,
  active = false,
  count,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    "aria-pressed": active,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-xs)",
      height: "var(--h-chip)",
      padding: "var(--pad-chip-y) var(--pad-chip-x)",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--button-md-size)",
      fontWeight: 500,
      lineHeight: "var(--button-md-lh)",
      cursor: "pointer",
      background: active ? "var(--action-chip-active-bg)" : "var(--action-chip-bg)",
      color: active ? "var(--action-chip-active-fg)" : "var(--action-chip-fg)",
      border: active ? "1px solid var(--ink)" : "var(--border-hairline)",
      ...style
    }
  }, rest), children, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: active ? "var(--stone)" : "var(--mute)",
      fontSize: "var(--caption-sm-size)"
    }
  }, "(", count, ")"));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/cards/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "var(--radius-pill)",
      background: "var(--canvas)",
      color: "var(--ink)",
      border: "var(--border-hairline)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--caption-sm-size)",
      fontWeight: 500,
      lineHeight: "var(--caption-sm-lh)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/PriceRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PriceRow({
  price,
  wasPrice,
  discount,
  size = "md",
  style,
  ...rest
}) {
  const fs = size === "lg" ? "var(--heading-lg-size)" : "var(--body-md-size)";
  const onSale = wasPrice != null;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-sm)",
      fontFamily: "var(--font-ui)",
      fontSize: fs,
      fontWeight: 500,
      lineHeight: "var(--body-md-lh)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: onSale ? "var(--text-price-sale)" : "var(--ink)"
    }
  }, price), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-price-was)",
      textDecoration: "line-through"
    }
  }, wasPrice), onSale && discount && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-price-sale)",
      fontSize: "var(--caption-md-size)"
    }
  }, discount));
}
Object.assign(__ds_scope, { PriceRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PriceRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide icon wrapper. The source kit shipped no icon assets, so Lucide
   (MIT, 2px stroke, round caps) stands in — see readme.md → Iconography.
   Requires the Lucide UMD script on the page; the wrapper re-runs
   createIcons() whenever the rendered name changes. */
function Icon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 2,
  style,
  ...rest
}) {
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
      attrs: {
        width: size,
        height: size,
        stroke: color,
        "stroke-width": strokeWidth
      },
      root: el
    });
  }, [name, size, color, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      flex: "0 0 auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  name,
  label,
  size = 40,
  iconSize = 20,
  variant = "soft",
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const fills = {
    soft: {
      background: "var(--soft-cloud)",
      color: "var(--ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)"
    },
    onImage: {
      background: "var(--canvas)",
      color: "var(--ink)"
    },
    inverse: {
      background: "var(--ink)",
      color: "var(--canvas)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/disclosure/DisclosureRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DisclosureRow({
  label,
  children,
  variant = "detail",
  defaultOpen = false,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const isFaq = variant === "faq";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderBottom: "var(--border-hairline)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    "aria-expanded": open,
    style: {
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
      lineHeight: isFaq ? "var(--heading-md-lh)" : "var(--body-md-lh)"
    }
  }, label, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? "chevron-up" : "chevron-down",
    size: 20
  })), open && children && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: "var(--pad-row)",
      fontSize: "var(--body-md-size)",
      fontWeight: 400,
      lineHeight: "var(--body-md-lh)",
      color: "var(--text-body)",
      maxWidth: "68ch"
    }
  }, children));
}
Object.assign(__ds_scope, { DisclosureRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/disclosure/DisclosureRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SearchPill({
  placeholder = "Search",
  value,
  onChange,
  width = 240,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      height: "var(--h-search)",
      width,
      padding: "var(--space-sm) var(--space-md)",
      borderRadius: "var(--radius-search)",
      background: focused ? "var(--canvas)" : "var(--soft-cloud)",
      border: focused ? "var(--focus-border)" : "2px solid transparent",
      boxShadow: focused ? "var(--focus-ring)" : "none",
      color: "var(--ink)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 18,
    color: "var(--ink)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      font: "inherit",
      fontSize: "var(--body-md-size)",
      color: "var(--ink)",
      width: "100%"
    }
  }, rest)));
}
Object.assign(__ds_scope, { SearchPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchPill.jsx", error: String((e && e.message) || e) }); }

// components/forms/SwatchDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SwatchDot({
  color = "var(--ink)",
  active = false,
  label,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    "aria-label": label,
    "aria-pressed": active,
    style: {
      width: active ? 20 : "var(--size-swatch-dot)",
      height: active ? 20 : "var(--size-swatch-dot)",
      padding: 0,
      borderRadius: "var(--radius-dot)",
      background: color,
      cursor: "pointer",
      boxShadow: active ? "0 0 0 2px var(--canvas) inset, 0 0 0 2px var(--ink)" : "0 0 0 1px var(--hairline)",
      border: "none",
      flex: "0 0 auto",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { SwatchDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SwatchDot.jsx", error: String((e && e.message) || e) }); }

// components/media/PhotoStage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The stage every photograph sits on. With `src` it renders the image
   full-bleed at the given ratio; without one it renders the soft-cloud
   studio backdrop plus a caption naming the shot that belongs there —
   the source kit shipped no photography. */
function PhotoStage({
  src,
  alt = "",
  ratio = "1/1",
  note,
  tone = "soft",
  children,
  style,
  ...rest
}) {
  const tones = {
    soft: "var(--soft-cloud)",
    ink: "var(--ink)",
    pale: "var(--accent-purple-pale)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: ratio,
      background: tones[tone] || tone,
      overflow: "hidden",
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-xl)",
      textAlign: "center",
      fontSize: "var(--caption-sm-size)",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: tone === "ink" ? "var(--stone)" : "var(--mute)"
    }
  }, note || "Photography"), children);
}
Object.assign(__ds_scope, { PhotoStage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/PhotoStage.jsx", error: String((e && e.message) || e) }); }

// components/cards/CampaignTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CampaignTile({
  headline,
  eyebrow,
  cta,
  ratio = "16/9",
  image,
  imageNote,
  headlineColor = "var(--canvas)",
  size = 96,
  align = "bottom",
  tone = "ink",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      borderRadius: "var(--radius-tile)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.PhotoStage, {
    src: image,
    ratio: ratio,
    note: imageNote || "Campaign photography",
    tone: tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-xl)",
      right: "var(--space-xl)",
      top: align === "top" ? "var(--space-xl)" : undefined,
      bottom: align === "bottom" ? "var(--space-xl)" : undefined,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "var(--space-lg)"
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: headlineColor
    }
  }, eyebrow), headline && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: size,
      lineHeight: "var(--display-campaign-lh)",
      textTransform: "uppercase",
      color: headlineColor,
      letterSpacing: 0,
      maxWidth: "14ch"
    }
  }, headline), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "onImage"
  }, cta)));
}
Object.assign(__ds_scope, { CampaignTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CampaignTile.jsx", error: String((e && e.message) || e) }); }

// components/cards/CategoryIconCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CategoryIconCard({
  label,
  image,
  imageNote,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      background: "var(--surface-card)",
      border: "none",
      borderRadius: "var(--radius-none)",
      padding: 0,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "var(--space-md)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.PhotoStage, {
    src: image,
    ratio: "1/1",
    note: imageNote || label
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, label));
}
Object.assign(__ds_scope, { CategoryIconCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CategoryIconCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/MemberBenefitCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MemberBenefitCard({
  headline,
  cta = "Explore",
  ratio = "4/5",
  image,
  imageNote,
  tone = "ink",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      borderRadius: "var(--radius-tile)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.PhotoStage, {
    src: image,
    ratio: ratio,
    note: imageNote || headline,
    tone: tone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-xl)",
      right: "var(--space-xl)",
      bottom: "var(--space-xl)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--heading-family)",
      fontSize: "var(--heading-lg-size)",
      fontWeight: 500,
      lineHeight: "var(--heading-lg-lh)",
      color: "var(--text-inverse)",
      maxWidth: "18ch"
    }
  }, headline), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "onImage"
  }, cta)));
}
Object.assign(__ds_scope, { MemberBenefitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MemberBenefitCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductCard({
  name,
  category,
  price,
  wasPrice,
  discount,
  badge,
  colors = [],
  colorCount,
  image,
  imageNote,
  ratio = "1/1",
  onClick,
  style,
  ...rest
}) {
  const [selected, setSelected] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-card)",
      padding: 0,
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.PhotoStage, {
    src: image,
    note: imageNote || name,
    ratio: ratio,
    alt: name
  }, badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "var(--space-md)",
      left: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, null, badge))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap-card-meta)",
      paddingTop: "var(--space-md)"
    }
  }, colors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-sm)"
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement(__ds_scope.SwatchDot, {
    key: i,
    color: c,
    active: i === selected,
    label: "Colorway " + (i + 1),
    onClick: e => setSelected(i)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--body-md-size)",
      fontWeight: 500,
      lineHeight: "var(--body-md-lh)",
      color: "var(--ink)"
    }
  }, name), category && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)"
    }
  }, category), colorCount && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-sm-size)",
      fontWeight: 500,
      color: "var(--mute)"
    }
  }, colorCount), /*#__PURE__*/React.createElement(__ds_scope.PriceRow, {
    price: price,
    wasPrice: wasPrice,
    discount: discount
  })));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterSidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FilterSidebar({
  groups = [],
  selected = [],
  onToggle,
  width = "var(--sidebar-filter)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({
    style: {
      width,
      background: "var(--canvas)",
      flex: "0 0 auto",
      ...style
    }
  }, rest), groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.title,
    style: {
      padding: "var(--space-lg) 0",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--body-md-size)",
      fontWeight: 500,
      color: "var(--ink)",
      marginBottom: "var(--space-md)"
    }
  }, g.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)",
      alignItems: "flex-start"
    }
  }, g.options.map(o => {
    const on = selected.includes(o.label);
    return /*#__PURE__*/React.createElement("button", {
      key: o.label,
      onClick: () => onToggle && onToggle(o.label),
      style: {
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: "var(--font-ui)",
        fontSize: "var(--caption-md-size)",
        fontWeight: 500,
        color: "var(--ink)",
        borderBottom: on ? "1px solid var(--ink)" : "1px solid transparent"
      }
    }, o.label, " ", o.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--mute)"
      }
    }, "(", o.count, ")"));
  })))));
}
Object.assign(__ds_scope, { FilterSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterSidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Footer({
  columns = [],
  fineprint = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: "var(--canvas)",
      borderTop: "var(--border-hairline)",
      padding: "var(--space-section) var(--container-gutter) var(--space-xl)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + Math.max(columns.length, 1) + ", 1fr)",
      gap: "var(--space-xl)"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--body-md-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, c.title), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)",
      textDecoration: "none"
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "var(--border-hairline)",
      marginTop: "var(--space-section)",
      paddingTop: "var(--space-lg)",
      display: "flex",
      gap: "var(--space-lg)",
      flexWrap: "wrap",
      fontSize: "var(--utility-xs-size)",
      lineHeight: "var(--utility-xs-lh)",
      fontWeight: 500,
      color: "var(--mute)"
    }
  }, fineprint.map(f => /*#__PURE__*/React.createElement("span", {
    key: f
  }, f))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PrimaryNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PrimaryNav({
  brand = "SUBTLE",
  items = [],
  active,
  onNavigate,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      background: "var(--canvas)",
      height: "var(--h-nav)",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-xl)",
      padding: "0 var(--container-gutter)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 22,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      color: "var(--ink)",
      flex: "0 0 auto"
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      gap: "var(--space-xl)"
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it,
    onClick: () => onNavigate && onNavigate(it),
    style: {
      background: "none",
      border: "none",
      padding: "0 0 2px",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--body-md-size)",
      fontWeight: 500,
      color: "var(--ink)",
      borderBottom: it === active ? "2px solid var(--ink)" : "2px solid transparent"
    }
  }, it))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SearchPill, {
    width: 200
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "heart",
    label: "Favourites",
    variant: "ghost"
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    name: "shopping-bag",
    label: "Bag",
    variant: "ghost"
  })));
}
Object.assign(__ds_scope, { PrimaryNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PrimaryNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SubNavStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SubNavStrip({
  breadcrumb = [],
  sort = "Featured",
  filtersHidden = false,
  onToggleFilters,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--canvas)",
      boxShadow: "var(--elevation-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-md) var(--container-gutter)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)"
    }
  }, breadcrumb.join(" / ")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-xl)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onToggleFilters,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--button-md-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, filtersHidden ? "Show Filters" : "Hide Filters", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sliders-horizontal",
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-sm)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--button-md-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, "Sort By: ", sort, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))));
}
Object.assign(__ds_scope, { SubNavStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SubNavStrip.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UtilityBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function UtilityBar({
  links = ["Find a Store", "Help", "Join Us", "Sign In"],
  left,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-utility-bar)",
      height: "var(--h-utility-bar)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--container-gutter)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--caption-sm-size)",
      fontWeight: 500,
      color: "var(--ink)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", null, left), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-md)"
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: l
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--stone)"
    }
  }, "|"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--ink)",
      textDecoration: "none"
    }
  }, l)))));
}
Object.assign(__ds_scope, { UtilityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UtilityBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/AppChrome.jsx
try { (() => {
const {
  Icon,
  Button
} = window.SubtleGradientDesignSystem_21f929;
const NAV = [{
  id: "dashboard",
  label: "Dashboard",
  icon: "layout-dashboard"
}, {
  id: "upload",
  label: "Upload & Clean",
  icon: "upload"
}, {
  id: "mapping",
  label: "Mapping Manager",
  icon: "git-merge"
}, {
  id: "table",
  label: "Clean Data Table",
  icon: "table"
}, {
  id: "reports",
  label: "Reports",
  icon: "bar-chart-3"
}];
function Sidebar({
  view,
  onNavigate,
  unmapped
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 264,
      flex: "0 0 auto",
      background: "var(--ink)",
      color: "var(--canvas)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px 24px",
      borderBottom: "1px solid var(--ash)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Archivo Narrow', Archivo, sans-serif",
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "0.01em",
      textTransform: "uppercase",
      lineHeight: 1.1
    }
  }, "Invoice Cleaning", /*#__PURE__*/React.createElement("br", null), "& Reporting"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--stone)",
      marginTop: 8
    }
  }, "Internal tool")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: "16px 12px",
      gap: 2
    }
  }, NAV.map(n => {
    const on = n.id === view;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNavigate(n.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 12px",
        background: on ? "var(--canvas)" : "transparent",
        color: on ? "var(--ink)" : "var(--hairline)",
        border: "none",
        cursor: "pointer",
        fontFamily: "Archivo, sans-serif",
        fontSize: 15,
        fontWeight: 500,
        textAlign: "left",
        borderRadius: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18
    }), n.label, n.id === "mapping" && unmapped > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        background: "var(--sale)",
        color: "var(--canvas)",
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "var(--radius-pill)"
      }
    }, unmapped));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      padding: "16px 24px 0",
      borderTop: "1px solid var(--ash)",
      fontSize: 12,
      lineHeight: 1.6,
      color: "var(--stone)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      marginBottom: 6
    }
  }, "Active dataset"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--hairline)"
    }
  }, window.INVOICE.file.name), /*#__PURE__*/React.createElement("div", null, window.INVOICE.stats.period)));
}
function PageHead({
  title,
  kicker,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24,
      paddingBottom: 18,
      borderBottom: "1px solid var(--ink)",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--mute)",
      marginBottom: 8
    }
  }, kicker), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Archivo Narrow', Archivo, sans-serif",
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      lineHeight: 1
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, actions));
}
function StatCard({
  label,
  value,
  sub,
  tone = "soft"
}) {
  const dark = tone === "ink";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? "var(--ink)" : "var(--soft-cloud)",
      color: dark ? "var(--canvas)" : "var(--ink)",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: dark ? "var(--stone)" : "var(--mute)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Archivo Narrow', Archivo, sans-serif",
      fontWeight: 700,
      fontSize: 34,
      lineHeight: 1,
      letterSpacing: "-0.01em"
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: dark ? "var(--hairline)" : "var(--mute)",
      borderTop: dark ? "1px solid var(--ash)" : "1px solid var(--hairline)",
      paddingTop: 10
    }
  }, sub));
}
function Panel({
  title,
  note,
  actions,
  children,
  pad = 24
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      border: "1px solid var(--hairline)",
      background: "var(--canvas)"
    }
  }, (title || actions) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "16px 24px",
      borderBottom: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, title), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 4
    }
  }, note)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: pad
    }
  }, children));
}
function StatusTag({
  status
}) {
  const map = {
    "mapped-name": {
      fg: "var(--success)",
      label: "Name"
    },
    "mapped-code": {
      fg: "var(--info)",
      label: "Code"
    },
    mapped: {
      fg: "var(--success)",
      label: "Mapped"
    },
    suggested: {
      fg: "var(--mute)",
      label: "Suggested"
    },
    unmapped: {
      fg: "var(--sale)",
      label: "Unmapped"
    }
  };
  const s = map[status] || map.unmapped;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: s.fg,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 9999,
      background: s.fg
    }
  }), s.label);
}
function GhostButton({
  children,
  icon,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 36,
      padding: "0 16px",
      background: "var(--canvas)",
      color: "var(--ink)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      fontFamily: "Archivo, sans-serif",
      fontSize: 14,
      fontWeight: 500
    }
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  }), children);
}
function Select({
  value,
  onChange,
  options,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--mute)"
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      height: 40,
      minWidth: 180,
      padding: "0 12px",
      background: "var(--soft-cloud)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-search)",
      fontFamily: "Archivo, sans-serif",
      fontSize: 14,
      color: "var(--ink)",
      cursor: "pointer"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
Object.assign(window, {
  Sidebar,
  PageHead,
  StatCard,
  Panel,
  StatusTag,
  GhostButton,
  Select,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/AppChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/Charts.jsx
try { (() => {
// Shared chart primitives. Deliberately plain SVG/flex so they match the report
// PDF: horizontal bars with the exact RM value labeled at the end of each bar.

function BarList({
  rows,
  labelKey = "outlet",
  valueKey = "amount",
  max,
  format = window.RM,
  height = 34
}) {
  const top = max || Math.max(...rows.map(r => r[valueKey]), 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r[labelKey],
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(140px, 260px) 1fr auto",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--charcoal)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    title: r[labelKey]
  }, r[labelKey]), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: r[valueKey] / top * 100 + "%",
      height: "100%",
      background: "var(--ink)"
    },
    title: format(r[valueKey])
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      minWidth: 110,
      textAlign: "right"
    }
  }, format(r[valueKey])))));
}
function ColumnChart({
  rows,
  labelKey = "month",
  valueKey = "amount",
  height = 180
}) {
  const top = Math.max(...rows.map(r => r[valueKey]), 1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
      height
    }
  }, rows.map(r => /*#__PURE__*/React.createElement("div", {
    key: r[labelKey],
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: 8,
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textAlign: "center",
      color: "var(--mute)",
      fontVariantNumeric: "tabular-nums"
    }
  }, window.RMk(r[valueKey])), /*#__PURE__*/React.createElement("div", {
    style: {
      height: r[valueKey] / top * 100 + "%",
      background: "var(--ink)"
    },
    title: window.RM(r[valueKey])
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textAlign: "center",
      color: "var(--mute)"
    }
  }, r[labelKey]))));
}
const DONUT_TONES = ["#111111", "#39393b", "#4b4b4d", "#707072", "#9e9ea0", "#cacacb", "#0a7281", "#e5e5e5"];
function Donut({
  rows,
  labelKey = "product",
  valueKey = "amount",
  size = 240,
  thickness = 42
}) {
  const total = rows.reduce((a, r) => a + r[valueKey], 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 32,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      flex: "0 0 auto"
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: `rotate(-90 ${size / 2} ${size / 2})`
  }, rows.map((row, i) => {
    const len = row[valueKey] / total * c;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: row[labelKey],
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: DONUT_TONES[i % DONUT_TONES.length],
      strokeWidth: thickness,
      strokeDasharray: `${len} ${c - len}`,
      strokeDashoffset: -offset
    }, /*#__PURE__*/React.createElement("title", null, `${row[labelKey]} — ${window.RM(row[valueKey])}`));
    offset += len;
    return el;
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 260,
      display: "flex",
      flexDirection: "column"
    }
  }, rows.map((row, i) => /*#__PURE__*/React.createElement("div", {
    key: row[labelKey],
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 0",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      flex: "0 0 auto",
      background: DONUT_TONES[i % DONUT_TONES.length]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--charcoal)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    title: row[labelKey]
  }, row[labelKey]), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 13,
      color: "var(--mute)",
      fontVariantNumeric: "tabular-nums"
    }
  }, window.RM(row[valueKey])), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      width: 56,
      textAlign: "right",
      fontVariantNumeric: "tabular-nums"
    }
  }, (row[valueKey] / total * 100).toFixed(1), "%")))));
}
Object.assign(window, {
  BarList,
  ColumnChart,
  Donut,
  DONUT_TONES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/Charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/DashboardScreen.jsx
try { (() => {
const {
  Icon,
  Button
} = window.SubtleGradientDesignSystem_21f929;
function DashboardScreen({
  onNavigate
}) {
  const d = window.INVOICE;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    kicker: "Overview",
    title: "Dashboard",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => onNavigate("upload")
    }, "Upload new file")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    tone: "ink",
    label: "Total sales",
    value: window.RMk(d.stats.totalSales),
    sub: d.stats.period
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Best outlet",
    value: d.byOutlet[0].outlet,
    sub: window.RM(d.byOutlet[0].amount)
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Best month",
    value: "Jun 2026",
    sub: window.RM(781240.9)
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Unmapped rows",
    value: d.stats.unmappedRows.toLocaleString(),
    sub: "Flagged, not dropped \u2014 resolve in Mapping Manager"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Sales by outlet",
    note: "Top 10 of 27, descending",
    actions: /*#__PURE__*/React.createElement(GhostButton, {
      icon: "arrow-right",
      onClick: () => onNavigate("reports")
    }, "Full report")
  }, /*#__PURE__*/React.createElement(BarList, {
    rows: d.byOutlet
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "Latest upload",
    pad: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      wordBreak: "break-all"
    }
  }, d.file.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 4
    }
  }, d.file.uploaded, " \xB7 ", d.file.size)), [["Raw rows in file", d.file.rows.toLocaleString()], ["Invoices parsed", d.parse.invoices.toLocaleString()], ["Line items", d.parse.lineItems.toLocaleString()], ["Date range detected", "1 Jan – 31 Jul 2026"], ["Distinct raw names", d.parse.rawNames]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 16,
      padding: "10px 24px",
      borderBottom: "1px solid var(--hairline-soft)",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums"
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(GhostButton, {
    icon: "download"
  }, "CSV"), /*#__PURE__*/React.createElement(GhostButton, {
    icon: "download"
  }, "XLSX"))), /*#__PURE__*/React.createElement(Panel, {
    title: "Go to",
    pad: 0
  }, NAV.filter(n => n.id !== "dashboard").map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "14px 24px",
      background: "none",
      border: "none",
      borderBottom: "1px solid var(--hairline-soft)",
      cursor: "pointer",
      fontFamily: "Archivo, sans-serif",
      fontSize: 14,
      fontWeight: 500,
      color: "var(--ink)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 17
  }), n.label, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    style: {
      marginLeft: "auto",
      color: "var(--stone)"
    }
  })))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Monthly sales, company-wide",
    note: "Computed from the uploaded range \u2014 not a fixed calendar"
  }, /*#__PURE__*/React.createElement(ColumnChart, {
    rows: d.monthly
  })));
}
Object.assign(window, {
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/MappingScreen.jsx
try { (() => {
const {
  Icon,
  Button,
  SearchPill
} = window.SubtleGradientDesignSystem_21f929;
function MappingScreen() {
  const d = window.INVOICE;
  const [tab, setTab] = React.useState("name");
  const [selected, setSelected] = React.useState(null);
  const th = {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--mute)",
    padding: "10px 16px",
    borderBottom: "1px solid var(--ink)"
  };
  const td = {
    padding: "12px 16px",
    fontSize: 14,
    borderBottom: "1px solid var(--hairline-soft)"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    kicker: "Step 2 \xB7 reusable across uploads",
    title: "Mapping Manager",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GhostButton, {
      icon: "plus"
    }, "Add new"), /*#__PURE__*/React.createElement(GhostButton, {
      icon: "pencil"
    }, "Edit selected"), /*#__PURE__*/React.createElement(GhostButton, {
      icon: "trash-2"
    }, "Delete selected"), /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "Save mappings"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    pad: 0,
    title: null,
    actions: null
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: "1px solid var(--hairline)"
    }
  }, [["name", "Name → Group", d.nameMap.length], ["code", "Code → Group", d.codeMap.length]].map(([id, label, n]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => {
      setTab(id);
      setSelected(null);
    },
    style: {
      flex: 1,
      padding: "14px 20px",
      background: tab === id ? "var(--canvas)" : "var(--soft-cloud)",
      border: "none",
      borderBottom: tab === id ? "2px solid var(--ink)" : "2px solid transparent",
      cursor: "pointer",
      fontFamily: "Archivo, sans-serif",
      fontSize: 15,
      fontWeight: 600,
      color: tab === id ? "var(--ink)" : "var(--mute)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--mute)",
      fontWeight: 500
    }
  }, "(", n, ")")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      borderBottom: "1px solid var(--hairline-soft)",
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(SearchPill, {
    placeholder: tab === "name" ? "Search raw names" : "Search codes",
    width: 260
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginLeft: "auto"
    }
  }, tab === "name" ? "Suggestions are drafted from chain prefixes — confirm or correct them." : "Fragment rules match anywhere inside a code.")), tab === "name" ? /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Raw name (as it appears in your data)"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Group (canonical outlet)"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 120
    }
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", null, d.nameMap.map(m => /*#__PURE__*/React.createElement("tr", {
    key: m.raw,
    onClick: () => setSelected(m.raw),
    style: {
      cursor: "pointer",
      background: selected === m.raw ? "var(--soft-cloud)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontVariantNumeric: "tabular-nums"
    }
  }, m.raw), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600,
      color: m.group ? "var(--ink)" : "var(--sale)"
    }
  }, m.group || "— not set —"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(StatusTag, {
    status: m.status
  })))))) : /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Invoice code / fragment"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Canonical outlet"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 120
    }
  }, "Match"))), /*#__PURE__*/React.createElement("tbody", null, d.codeMap.map(m => /*#__PURE__*/React.createElement("tr", {
    key: m.pattern,
    onClick: () => setSelected(m.pattern),
    style: {
      cursor: "pointer",
      background: selected === m.pattern ? "var(--soft-cloud)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: "ui-monospace, monospace",
      fontVariantNumeric: "tabular-nums"
    }
  }, m.pattern), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600
    }
  }, m.group), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontSize: 13,
      color: "var(--mute)"
    }
  }, m.match)))))), /*#__PURE__*/React.createElement(Panel, {
    title: "Why outlet names need mapping",
    pad: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      fontSize: 14,
      lineHeight: 1.6,
      color: "var(--charcoal)",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, "The ", /*#__PURE__*/React.createElement("strong", null, "Name"), " column is typed at the point of sale, so one retail chain arrives under dozens of spellings \u2014 and on some invoices it isn't a store name at all. Mapping collapses those variants onto one canonical outlet so totals are counted once."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--mute)",
      marginBottom: 10
    }
  }, "Case 1 \u2014 many spellings, one chain"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginBottom: 10
    }
  }, "Use ", /*#__PURE__*/React.createElement("strong", null, "Name \u2192 Group"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      padding: 14,
      fontSize: 13,
      fontFamily: "ui-monospace, monospace",
      lineHeight: 1.8
    }
  }, "ECONSAVE - AMPANG BARU", /*#__PURE__*/React.createElement("br", null), "ECONSAVE - BAGAN SERAI", /*#__PURE__*/React.createElement("br", null), "ECONSAVE - BATU GAJAH", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)"
    }
  }, "\u2193"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "ECONSAVE"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--mute)",
      marginBottom: 10
    }
  }, "Case 2 \u2014 the name is a branch code"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginBottom: 10
    }
  }, "Use ", /*#__PURE__*/React.createElement("strong", null, "Code \u2192 Group"), ". The ", /*#__PURE__*/React.createElement("strong", null, "Code"), " column is the reliable key."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      padding: 14,
      fontSize: 13,
      fontFamily: "ui-monospace, monospace",
      lineHeight: 1.8
    }
  }, "Name: 10068 AMPANG BARU", /*#__PURE__*/React.createElement("br", null), "Code: 300-10042", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)"
    }
  }, "\u2193 matched on code"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "ECONSAVE")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 12,
      lineHeight: 1.6
    }
  }, "Fragments work too: a rule on ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "ui-monospace, monospace"
    }
  }, "SNWG"), " resolves any code containing it to Senawang.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 17,
    color: "var(--mute)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      lineHeight: 1.6
    }
  }, "Mappings persist and apply to every future upload. Rows unresolved after both layers are flagged in the Clean Data Table, never dropped.")))));
}
Object.assign(window, {
  MappingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/MappingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/ReportsScreen.jsx
try { (() => {
const {
  Icon,
  Button
} = window.SubtleGradientDesignSystem_21f929;
function ReportsScreen() {
  const d = window.INVOICE;
  const [outlet, setOutlet] = React.useState("ECONSAVE");
  const [page, setPage] = React.useState(0);
  const products = d.productsByOutlet[outlet] || d.productsByOutlet.ECONSAVE;
  const perPage = 24;
  const pages = Math.max(1, Math.ceil(products.length / perPage));
  const outletTotal = products.reduce((a, p) => a + p.amount, 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    kicker: `Yearly overview · ${d.stats.period}`,
    title: "Reports",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GhostButton, {
      icon: "download"
    }, "CSV"), /*#__PURE__*/React.createElement(GhostButton, {
      icon: "download"
    }, "XLSX"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "file-down",
        size: 16
      })
    }, "Download PDF"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    tone: "ink",
    label: "Total sales, period",
    value: window.RMk(d.stats.totalSales),
    sub: d.stats.period
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Best-selling outlet",
    value: d.byOutlet[0].outlet,
    sub: window.RM(d.byOutlet[0].amount)
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Best-selling product",
    value: "Carbonara Mushroom",
    sub: window.RM(d.contribution[0].amount) + " · 14.2% of total"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Best month",
    value: "Jun 2026",
    sub: window.RM(781240.9)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    title: "1 \u2014 Yearly overview: sales by outlet",
    note: `${d.stats.outlets} outlets · ${window.RM(d.stats.totalSales)} company-wide · ${d.stats.period}`
  }, /*#__PURE__*/React.createElement(BarList, {
    rows: d.byOutlet
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "2 \u2014 Product sales per outlet",
    note: `${outlet} · ${window.RM(outletTotal)}`,
    actions: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Select, {
      value: outlet,
      onChange: v => {
        setOutlet(v);
        setPage(0);
      },
      options: Object.keys(d.productsByOutlet)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--mute)",
        whiteSpace: "nowrap"
      }
    }, "Page ", page + 1, " of ", pages))
  }, /*#__PURE__*/React.createElement(BarList, {
    rows: products.slice(page * perPage, (page + 1) * perPage),
    labelKey: "product"
  }), pages > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(GhostButton, {
    icon: "chevron-left",
    onClick: () => setPage(Math.max(0, page - 1))
  }, "Previous"), /*#__PURE__*/React.createElement(GhostButton, {
    icon: "chevron-right",
    onClick: () => setPage(Math.min(pages - 1, page + 1))
  }, "Next"))), /*#__PURE__*/React.createElement(Panel, {
    title: "3 \u2014 Product contribution to total sales",
    note: "Top products as named slices, everything else rolled into Others"
  }, /*#__PURE__*/React.createElement(Donut, {
    rows: d.contribution
  })), /*#__PURE__*/React.createElement(Panel, {
    title: '“Others” — detailed breakdown',
    note: "What sits inside the Others slice, as a share of company-wide sales"
  }, /*#__PURE__*/React.createElement(Donut, {
    rows: d.others
  })), /*#__PURE__*/React.createElement(Panel, {
    title: "Best-selling outlet per month"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8
    }
  }, [["Jan 2026", "ECONSAVE", 182400.5], ["Feb 2026", "ECONSAVE", 174220.0], ["Mar 2026", "BORONG DIN AS CASH & CARRY", 168840.75], ["Apr 2026", "ECONSAVE", 191240.3], ["May 2026", "MYDIN", 158920.4], ["Jun 2026", "ECONSAVE", 204110.9], ["Jul 2026", "ECONSAVE", 186880.25]].map(([m, o, v]) => /*#__PURE__*/React.createElement("div", {
    key: m,
    style: {
      background: "var(--soft-cloud)",
      padding: "14px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--mute)"
    }
  }, m), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginTop: 6
    }
  }, o), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 2,
      fontVariantNumeric: "tabular-nums"
    }
  }, window.RM(v))))))));
}
Object.assign(window, {
  ReportsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/ReportsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/TableScreen.jsx
try { (() => {
const {
  Icon,
  Button,
  SearchPill
} = window.SubtleGradientDesignSystem_21f929;
function TableScreen() {
  const d = window.INVOICE;
  const [mode, setMode] = React.useState("all");
  const [outlet, setOutlet] = React.useState("ECONSAVE");
  const [month, setMonth] = React.useState("2026-01");
  const [generated, setGenerated] = React.useState(false);
  const outlets = ["All outlets", ...Array.from(new Set(d.rows.map(r => r.outlet)))];
  const months = Array.from(new Set(d.rows.map(r => r.month))).sort();
  const rows = mode === "all" ? d.rows : d.rows.filter(r => r.outlet === outlet && r.month === month);
  const th = {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--mute)",
    padding: "10px 14px",
    borderBottom: "1px solid var(--ink)",
    whiteSpace: "nowrap"
  };
  const td = {
    padding: "11px 14px",
    fontSize: 13,
    borderBottom: "1px solid var(--hairline-soft)",
    whiteSpace: "nowrap"
  };
  const num = {
    ...td,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums"
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    kicker: "Step 3",
    title: "Clean Data Table",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(GhostButton, {
      icon: "download"
    }, "CSV"), /*#__PURE__*/React.createElement(GhostButton, {
      icon: "download"
    }, "XLSX"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0,
      marginBottom: 8,
      border: "1px solid var(--hairline)"
    }
  }, [["all", "All months"], ["filtered", "Outlet + Month"]].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => {
      setMode(id);
      setGenerated(false);
    },
    style: {
      flex: 1,
      padding: "12px 20px",
      background: mode === id ? "var(--ink)" : "var(--canvas)",
      color: mode === id ? "var(--canvas)" : "var(--ink)",
      border: "none",
      cursor: "pointer",
      fontFamily: "Archivo, sans-serif",
      fontSize: 15,
      fontWeight: 600
    }
  }, label))), mode === "filtered" && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      border: "1px solid var(--hairline)",
      padding: 20,
      marginBottom: 8,
      display: "flex",
      gap: 16,
      alignItems: "flex-end",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginRight: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600
    }
  }, "Generate detailed monthly report"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 4
    }
  }, "Filters the clean table to one outlet, one month, and exports it.")), /*#__PURE__*/React.createElement(Select, {
    label: "Outlet",
    value: outlet,
    onChange: setOutlet,
    options: outlets.filter(o => o !== "All outlets")
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Month",
    value: month,
    onChange: setMonth,
    options: months
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => setGenerated(true)
  }, "Generate")), /*#__PURE__*/React.createElement(Panel, {
    pad: 0,
    title: mode === "all" ? "All cleaned line items" : `${outlet} · ${month}`,
    note: mode === "all" ? `${d.parse.lineItems.toLocaleString()} rows · Jan – Jul 2026 · showing first ${rows.length}` : generated ? `${rows.length} rows in this view` : "Pick an outlet and month, then Generate.",
    actions: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(StatusTag, {
      status: "unmapped"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--mute)"
      }
    }, d.stats.unmappedRows, " flagged rows"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Outlet"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Invoice No"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Product"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: "right"
    }
  }, "Qty"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "UOM"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: "right"
    }
  }, "Unit price"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: "right"
    }
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Raw name"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Mapping"))), /*#__PURE__*/React.createElement("tbody", null, (mode === "all" || generated ? rows : []).map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      background: r.status === "unmapped" ? "#fff4f4" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600
    }
  }, r.outlet), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: "ui-monospace, monospace"
    }
  }, r.invoice), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.date), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      whiteSpace: "normal",
      minWidth: 280,
      color: "var(--charcoal)"
    }
  }, r.product), /*#__PURE__*/React.createElement("td", {
    style: num
  }, r.qty), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: "var(--mute)"
    }
  }, r.uom), /*#__PURE__*/React.createElement("td", {
    style: num
  }, r.unit.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...num,
      fontWeight: 600
    }
  }, r.amount.toFixed(2)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: "var(--mute)",
      maxWidth: 220,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.raw || "—"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(StatusTag, {
    status: r.status
  })))))), mode === "filtered" && !generated && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "48px 24px",
      textAlign: "center",
      color: "var(--mute)",
      fontSize: 14
    }
  }, "Nothing generated yet."))));
}
Object.assign(window, {
  TableScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/TableScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/UploadScreen.jsx
try { (() => {
const {
  Icon,
  Button
} = window.SubtleGradientDesignSystem_21f929;
function UploadScreen({
  onNavigate
}) {
  const d = window.INVOICE;
  const [stage, setStage] = React.useState("parsed"); // idle | parsed | cleaning | clean
  const unmapped = d.nameMap.filter(m => m.status !== "mapped").length;
  const runClean = () => {
    setStage("cleaning");
    setTimeout(() => setStage("clean"), 900);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
    kicker: "Step 1",
    title: "Upload & Clean",
    actions: stage === "clean" && /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => onNavigate("table")
    }, "View clean table")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 400px",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setStage("parsed"),
    style: {
      border: "1px dashed var(--hairline)",
      background: "var(--soft-cloud)",
      padding: "48px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      cursor: "pointer",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-spreadsheet",
    size: 32,
    color: "var(--mute)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "Drop the raw Invoice Listing export here"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--mute)",
      maxWidth: "52ch"
    }
  }, "Accepts the paginated ", /*#__PURE__*/React.createElement("strong", null, ".xlsx"), " dumped from the accounting system. Page banners, repeated headers and filter metadata are stripped automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary"
  }, "Choose file"))), stage !== "idle" && /*#__PURE__*/React.createElement(Panel, {
    title: "Parse preview",
    note: `${d.file.name} · ${d.file.size}`,
    actions: /*#__PURE__*/React.createElement(StatusTag, {
      status: unmapped ? "unmapped" : "mapped"
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Invoices",
    value: d.parse.invoices.toLocaleString()
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Line items",
    value: d.parse.lineItems.toLocaleString()
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Distinct raw names",
    value: d.parse.rawNames
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, [["Date range detected in file", "1 Jan 2026 – 31 Jul 2026"], ["Wrapped descriptions stitched", d.parse.continuationRows + " rows"], ["Page banners / headers discarded", d.parse.discardedRows.toLocaleString() + " rows"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderTop: "1px solid var(--hairline-soft)",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      background: unmapped ? "#fff4f4" : "var(--soft-cloud)",
      border: `1px solid ${unmapped ? "var(--sale)" : "var(--hairline)"}`,
      padding: 20,
      display: "flex",
      gap: 16,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: unmapped ? "alert-triangle" : "check",
    size: 20,
    color: unmapped ? "var(--sale)" : "var(--success)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: unmapped ? "var(--sale)" : "var(--ink)"
    }
  }, unmapped, " raw outlet names have no mapping"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--charcoal)",
      marginTop: 6,
      lineHeight: 1.5,
      maxWidth: "62ch"
    }
  }, "Unmapped names are what silently corrupt outlet totals \u2014 the same store gets counted twice under two spellings. Resolve them before cleaning, or clean now and review the flagged rows afterwards.")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => onNavigate("mapping")
  }, "Resolve")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      marginTop: 20,
      paddingTop: 20,
      borderTop: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: runClean
  }, stage === "cleaning" ? "Cleaning…" : stage === "clean" ? "Re-run clean" : "Clean"), stage === "clean" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StatusTag, {
    status: "mapped"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--mute)"
    }
  }, d.parse.lineItems.toLocaleString(), " clean rows produced"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(GhostButton, {
    icon: "download"
  }, "CSV"), /*#__PURE__*/React.createElement(GhostButton, {
    icon: "download"
  }, "XLSX")))))), /*#__PURE__*/React.createElement(Panel, {
    title: "What the cleaner does",
    note: "app/invoice_cleaner/parser.py",
    pad: 0
  }, [["Classify every row", "Invoice header (IV-#####), line item (integer Seq), or report noise."], ["Stitch wrapped names", "A row holding only a Description cell is joined onto the product above it."], ["Carry invoice context down", "Doc No, date, code and raw name flow onto each line item below."], ["Resolve the outlet", "Name → Group first, then Code → Group when the name is numeric or missing."], ["Flag, never drop", "Anything unresolved keeps its raw value and is marked unmapped."]].map(([t, b], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 14,
      padding: "16px 24px",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'Archivo Narrow', Archivo, sans-serif",
      fontWeight: 700,
      fontSize: 18,
      color: "var(--stone)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--mute)",
      marginTop: 4,
      lineHeight: 1.5
    }
  }, b)))))));
}
Object.assign(window, {
  UploadScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/UploadScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/invoice-cleaner/data.js
try { (() => {
// Sample cleaned dataset standing in for the Python API's responses.
// Shapes match app/server.py exactly, so swapping fetch() calls in is a one-line change.
window.INVOICE = {
  file: {
    name: "IKA_IV_LISTING_JAN-JULY.xlsx",
    uploaded: "11 Aug 2026, 09:14",
    size: "4.2 MB",
    rows: 19812
  },
  parse: {
    invoices: 1681,
    lineItems: 8934,
    dateFrom: "2026-01-01",
    dateTo: "2026-07-31",
    rawNames: 214,
    continuationRows: 138,
    discardedRows: 10740
  },
  stats: {
    totalSales: 4812640.55,
    period: "Jan 2026 – Jul 2026",
    outlets: 27,
    products: 168,
    unmappedRows: 412
  },
  byOutlet: [{
    outlet: "ECONSAVE",
    amount: 1284310.4
  }, {
    outlet: "BORONG DIN AS CASH & CARRY",
    amount: 862140.15
  }, {
    outlet: "MYDIN",
    amount: 611280.0
  }, {
    outlet: "LOTUS'S",
    amount: 498220.7
  }, {
    outlet: "99 SPEEDMART",
    amount: 402115.25
  }, {
    outlet: "BILLION",
    amount: 336900.5
  }, {
    outlet: "TF VALUE MART",
    amount: 288740.0
  }, {
    outlet: "SEGI FRESH",
    amount: 214880.35
  }, {
    outlet: "NSK TRADE CITY",
    amount: 172640.9
  }, {
    outlet: "PASARAYA HERO",
    amount: 140412.3
  }],
  monthly: [{
    month: "2026-01",
    amount: 612340.2
  }, {
    month: "2026-02",
    amount: 588120.75
  }, {
    month: "2026-03",
    amount: 704880.4
  }, {
    month: "2026-04",
    amount: 668240.1
  }, {
    month: "2026-05",
    amount: 742110.6
  }, {
    month: "2026-06",
    amount: 781240.9
  }, {
    month: "2026-07",
    amount: 715707.6
  }],
  contribution: [{
    product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12",
    amount: 684220.4
  }, {
    product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12",
    amount: 521340.8
  }, {
    product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12",
    amount: 448120.0
  }, {
    product: "RASTO CHILLI SAUCE 340G X 24",
    amount: 362410.5
  }, {
    product: "RASTO TOMATO KETCHUP 500G X 12",
    amount: 298640.25
  }, {
    product: "RASTO OYSTER SAUCE 510G X 12",
    amount: 241880.9
  }, {
    product: "Others",
    amount: 2256027.7
  }],
  others: [{
    product: "RASTO SOY SAUCE 640ML X 12",
    amount: 188420.3
  }, {
    product: "RASTO CHILLI GARLIC 340G X 24",
    amount: 164280.1
  }, {
    product: "RASTO BLACK PEPPER SAUCE 300G X 12",
    amount: 142110.45
  }, {
    product: "RASTO MAYONNAISE 470G X 12",
    amount: 128940.0
  }, {
    product: "Remaining products",
    amount: 1632276.85
  }],
  productsByOutlet: {
    ECONSAVE: [{
      product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12",
      amount: 284120.5
    }, {
      product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12",
      amount: 221480.0
    }, {
      product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12",
      amount: 188640.75
    }, {
      product: "RASTO CHILLI SAUCE 340G X 24",
      amount: 142310.2
    }, {
      product: "RASTO TOMATO KETCHUP 500G X 12",
      amount: 118420.9
    }, {
      product: "RASTO OYSTER SAUCE 510G X 12",
      amount: 96840.15
    }, {
      product: "RASTO SOY SAUCE 640ML X 12",
      amount: 74210.4
    }, {
      product: "RASTO MAYONNAISE 470G X 12",
      amount: 58286.5
    }],
    MYDIN: [{
      product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12",
      amount: 168420.0
    }, {
      product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12",
      amount: 142880.5
    }, {
      product: "RASTO CHILLI SAUCE 340G X 24",
      amount: 118240.75
    }, {
      product: "RASTO TOMATO KETCHUP 500G X 12",
      amount: 96440.25
    }, {
      product: "RASTO OYSTER SAUCE 510G X 12",
      amount: 85298.5
    }]
  },
  nameMap: [{
    raw: "ECONSAVE - AMPANG BARU",
    group: "ECONSAVE",
    status: "mapped"
  }, {
    raw: "ECONSAVE - BAGAN SERAI",
    group: "ECONSAVE",
    status: "mapped"
  }, {
    raw: "ECONSAVE - BATU GAJAH",
    group: "ECONSAVE",
    status: "mapped"
  }, {
    raw: "ECONSAVE - BANDAR SERI BOTANI",
    group: "ECONSAVE",
    status: "suggested"
  }, {
    raw: "BORONG DIN AS CASH & CARRY (BAGAN SERAI)",
    group: "BORONG DIN AS CASH & CARRY",
    status: "mapped"
  }, {
    raw: "BORONG DIN AS CASH & CARRY (SUNGAI PETANI)",
    group: "BORONG DIN AS CASH & CARRY",
    status: "suggested"
  }, {
    raw: "MYDIN MOHAMED HOLDINGS - USJ",
    group: "MYDIN",
    status: "mapped"
  }, {
    raw: "LOTUSS STORES (M) SDN BHD - IPOH",
    group: "LOTUS'S",
    status: "mapped"
  }, {
    raw: "99 SPEED MART S/B - PJ",
    group: "99 SPEEDMART",
    status: "suggested"
  }, {
    raw: "SEGI FRESH DIST SDN BHD",
    group: "",
    status: "unmapped"
  }],
  codeMap: [{
    pattern: "300-10042",
    group: "ECONSAVE",
    match: "Exact"
  }, {
    pattern: "300-B0133",
    group: "BANGI",
    match: "Exact"
  }, {
    pattern: "SNWG",
    group: "SENAWANG",
    match: "Fragment"
  }, {
    pattern: "300-M01",
    group: "MYDIN",
    match: "Prefix"
  }, {
    pattern: "300-N0",
    group: "NSK TRADE CITY",
    match: "Prefix"
  }],
  rows: [{
    outlet: "ECONSAVE",
    invoice: "IV-13371",
    date: "05/01/2026",
    month: "2026-01",
    product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12",
    qty: 10,
    uom: "CTN",
    unit: 90.0,
    amount: 900.0,
    raw: "ECONSAVE - AMPANG BARU",
    status: "mapped-name"
  }, {
    outlet: "ECONSAVE",
    invoice: "IV-13371",
    date: "05/01/2026",
    month: "2026-01",
    product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12",
    qty: 10,
    uom: "CTN",
    unit: 60.0,
    amount: 600.0,
    raw: "ECONSAVE - AMPANG BARU",
    status: "mapped-name"
  }, {
    outlet: "ECONSAVE",
    invoice: "IV-13372",
    date: "07/01/2026",
    month: "2026-01",
    product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12",
    qty: 5,
    uom: "CTN",
    unit: 80.0,
    amount: 400.0,
    raw: "10068 AMPANG BARU",
    status: "mapped-code"
  }, {
    outlet: "BORONG DIN AS CASH & CARRY",
    invoice: "IV-13380",
    date: "12/01/2026",
    month: "2026-01",
    product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12",
    qty: 24,
    uom: "CTN",
    unit: 88.5,
    amount: 2124.0,
    raw: "BORONG DIN AS CASH & CARRY (BAGAN SERAI)",
    status: "mapped-name"
  }, {
    outlet: "MYDIN",
    invoice: "IV-13402",
    date: "19/02/2026",
    month: "2026-02",
    product: "RASTO CHILLI SAUCE 340G X 24",
    qty: 18,
    uom: "CTNe",
    unit: 112.0,
    amount: 2016.0,
    raw: "MYDIN MOHAMED HOLDINGS - USJ",
    status: "mapped-name"
  }, {
    outlet: "SENAWANG",
    invoice: "IV-13455",
    date: "03/03/2026",
    month: "2026-03",
    product: "RASTO TOMATO KETCHUP 500G X 12",
    qty: 12,
    uom: "CTN",
    unit: 64.0,
    amount: 768.0,
    raw: "",
    status: "mapped-code"
  }, {
    outlet: "SEGI FRESH DIST SDN BHD",
    invoice: "IV-13501",
    date: "22/03/2026",
    month: "2026-03",
    product: "RASTO OYSTER SAUCE 510G X 12",
    qty: 8,
    uom: "CTN",
    unit: 74.5,
    amount: 596.0,
    raw: "SEGI FRESH DIST SDN BHD",
    status: "unmapped"
  }, {
    outlet: "LOTUS'S",
    invoice: "IV-13540",
    date: "08/04/2026",
    month: "2026-04",
    product: "RASTO MAYONNAISE 470G X 12",
    qty: 15,
    uom: "CTN",
    unit: 58.0,
    amount: 870.0,
    raw: "LOTUSS STORES (M) SDN BHD - IPOH",
    status: "mapped-name"
  }, {
    outlet: "99 SPEEDMART",
    invoice: "IV-13588",
    date: "17/05/2026",
    month: "2026-05",
    product: "RASTO SOY SAUCE 640ML X 12",
    qty: 30,
    uom: "CTN",
    unit: 42.0,
    amount: 1260.0,
    raw: "99 SPEED MART S/B - PJ",
    status: "mapped-name"
  }, {
    outlet: "10106 BATU GAJAH",
    invoice: "IV-13610",
    date: "02/06/2026",
    month: "2026-06",
    product: "RASTO BLACK PEPPER SAUCE 300G X 12",
    qty: 6,
    uom: "CTN",
    unit: 96.0,
    amount: 576.0,
    raw: "10106 BATU GAJAH",
    status: "unmapped"
  }, {
    outlet: "BILLION",
    invoice: "IV-13655",
    date: "21/06/2026",
    month: "2026-06",
    product: "RASTO CHILLI GARLIC 340G X 24",
    qty: 20,
    uom: "CTNe",
    unit: 104.0,
    amount: 2080.0,
    raw: "BILLION SHOPPING CENTRE - KLANG",
    status: "mapped-name"
  }, {
    outlet: "ECONSAVE",
    invoice: "IV-13702",
    date: "14/07/2026",
    month: "2026-07",
    product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12",
    qty: 40,
    uom: "CTN",
    unit: 90.0,
    amount: 3600.0,
    raw: "ECONSAVE - BATU GAJAH",
    status: "mapped-name"
  }]
};
window.RM = n => "RM " + n.toLocaleString("en-MY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
window.RMk = n => n >= 1000000 ? "RM " + (n / 1000000).toFixed(2) + "M" : "RM " + Math.round(n / 1000) + "k";
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/invoice-cleaner/data.js", error: String((e && e.message) || e) }); }

// ui_kits/storefront/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  CampaignTile,
  ProductCard,
  CategoryIconCard,
  PhotoStage,
  Button,
  IconButton
} = window.SubtleGradientDesignSystem_21f929;
function HomeScreen({
  onOpenListing,
  onOpenProduct
}) {
  const d = window.STOREFRONT;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-section)",
      paddingBottom: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement(CampaignTile, {
    ratio: "16/9",
    eyebrow: "Trail Collection",
    headline: "Hold the line",
    cta: "Shop Trail",
    imageNote: "Full-bleed campaign photography \u2014 runner on exposed ridge"
  }), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Trending Now",
    action: "Shop All",
    onAction: onOpenListing
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, d.products.slice(0, 4).map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.name
  }, p, {
    onClick: () => onOpenProduct(p)
  }))))), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Shop by Sport"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--gap-grid)",
      overflowX: "auto"
    }
  }, d.sports.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.label,
    style: {
      flex: "0 0 240px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(PhotoStage, {
    ratio: "4/5",
    note: s.note,
    tone: "ink"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "var(--space-lg)",
      bottom: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "onImage",
    size: "sm",
    onClick: onOpenListing
  }, s.label)))))), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gap-grid)"
    }
  }, /*#__PURE__*/React.createElement(CampaignTile, {
    ratio: "4/5",
    headline: "Pace",
    size: 64,
    cta: "Shop Road",
    imageNote: "Editorial: road session, cool grade",
    tone: "ink"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--gap-grid)"
    }
  }, /*#__PURE__*/React.createElement(PhotoStage, {
    ratio: "16/9",
    note: "Product still life \u2014 spike plate detail"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--gap-grid)"
    }
  }, d.products.slice(4, 6).map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.name
  }, p, {
    onClick: () => onOpenProduct(p)
  }))))))), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Latest in Clothing"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, d.categories.map(c => /*#__PURE__*/React.createElement(CategoryIconCard, {
    key: c,
    label: c,
    imageNote: c,
    onClick: onOpenListing
  })))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ListingScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SubNavStrip,
  FilterSidebar,
  FilterChip,
  ProductCard
} = window.SubtleGradientDesignSystem_21f929;
function ListingScreen({
  onOpenProduct
}) {
  const d = window.STOREFRONT;
  const [hidden, setHidden] = React.useState(false);
  const [selected, setSelected] = React.useState(["Trail"]);
  const toggle = l => setSelected(s => s.includes(l) ? s.filter(x => x !== l) : [...s, l]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubNavStrip, {
    breadcrumb: ["Men", "Shoes", "Trail Running"],
    filtersHidden: hidden,
    onToggleFilters: () => setHidden(!hidden),
    sort: "Featured"
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: "var(--space-xl)",
      paddingBottom: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-section)"
    }
  }, !hidden && /*#__PURE__*/React.createElement(FilterSidebar, {
    groups: d.filters,
    selected: selected,
    onToggle: toggle
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--heading-family)",
      fontSize: "var(--heading-xl-size)",
      fontWeight: 500
    }
  }, "Men's Trail Running Shoes"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)"
    }
  }, d.products.length, " Results")), selected.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      flexWrap: "wrap",
      marginBottom: "var(--space-xl)"
    }
  }, selected.map(s => /*#__PURE__*/React.createElement(FilterChip, {
    key: s,
    active: true,
    onClick: () => toggle(s)
  }, s, " \u2715"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, d.products.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.name
  }, p, {
    onClick: () => onOpenProduct(p)
  }))))))));
}
Object.assign(window, {
  ListingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ListingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/MembershipScreen.jsx
try { (() => {
const {
  CampaignTile,
  MemberBenefitCard,
  DisclosureRow,
  Button
} = window.SubtleGradientDesignSystem_21f929;
function MembershipScreen() {
  const benefits = ["Member-only products", "Free delivery, every order", "Exclusive access to events"];
  const faqs = ["How do I become a member?", "Is membership free?", "What are member rewards?", "How do I cancel my membership?"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-section)",
      paddingBottom: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement(CampaignTile, {
    ratio: "16/9",
    eyebrow: "Membership",
    headline: "Become a member",
    cta: "Join Us",
    imageNote: "Membership campaign \u2014 group run, dusk"
  }), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Member Benefits"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, benefits.map(b => /*#__PURE__*/React.createElement(MemberBenefitCard, {
    key: b,
    headline: b,
    imageNote: b
  })))), /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "var(--space-section)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "Frequently Asked Questions"
  }), faqs.map(f => /*#__PURE__*/React.createElement(DisclosureRow, {
    key: f,
    label: f,
    variant: "faq"
  }, "Membership is free. Join online or in the app and your benefits apply to your next order."))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--soft-cloud)",
      padding: "var(--space-section)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--heading-family)",
      fontSize: "var(--heading-lg-size)",
      fontWeight: 500,
      lineHeight: "var(--heading-lg-lh)",
      maxWidth: "22ch"
    }
  }, "Join free and get first access to new arrivals."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--body-md-size)",
      color: "var(--text-body)",
      maxWidth: "44ch"
    }
  }, "Members get free delivery on every order, member-only products, and entry to local run events."), /*#__PURE__*/React.createElement(Button, null, "Join Us")))));
}
Object.assign(window, {
  MembershipScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/MembershipScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  PhotoStage,
  SwatchDot,
  Button,
  IconButton,
  PriceRow,
  Badge,
  DisclosureRow,
  ProductCard
} = window.SubtleGradientDesignSystem_21f929;
const SIZES = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];
function ProductScreen({
  product,
  onAdded
}) {
  const p = product || window.STOREFRONT.products[0];
  const [color, setColor] = React.useState(0);
  const [size, setSize] = React.useState(null);
  const [shot, setShot] = React.useState(0);
  const shots = ["Three-quarter", "Medial", "Lateral", "Top down", "Outsole", "On foot"];
  return /*#__PURE__*/React.createElement(Container, {
    style: {
      paddingTop: "var(--space-xl)",
      paddingBottom: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "72px 1fr 400px",
      gap: "var(--space-xl)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, shots.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setShot(i),
    style: {
      padding: 0,
      border: "none",
      background: "none",
      cursor: "pointer",
      boxShadow: i === shot ? "inset 0 0 0 1px var(--ink)" : "none"
    }
  }, /*#__PURE__*/React.createElement(PhotoStage, {
    ratio: "1/1",
    note: s
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(PhotoStage, {
    ratio: "1/1",
    note: shots[shot] + " — product on soft-cloud studio"
  }), p.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "var(--space-md)",
      left: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement(Badge, null, p.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "var(--space-md)",
      bottom: "var(--space-md)",
      display: "flex",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "chevron-left",
    label: "Previous image",
    variant: "onImage"
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "chevron-right",
    label: "Next image",
    variant: "onImage"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--heading-family)",
      fontSize: "var(--heading-xl-size)",
      fontWeight: 500,
      lineHeight: "var(--heading-xl-lh)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)",
      marginTop: "var(--space-sm)"
    }
  }, p.category)), /*#__PURE__*/React.createElement(PriceRow, {
    size: "lg",
    price: p.price,
    wasPrice: p.wasPrice,
    discount: p.discount
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--mute)",
      marginBottom: "var(--space-sm)"
    }
  }, "Select Colour"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)",
      alignItems: "center"
    }
  }, (p.colors || ["#111111"]).map((c, i) => /*#__PURE__*/React.createElement(SwatchDot, {
    key: i,
    color: c,
    active: i === color,
    label: "Colorway " + (i + 1),
    onClick: () => setColor(i)
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      marginBottom: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mute)"
    }
  }, "Select Size"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--ink)"
    }
  }, "Size Guide")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-sm)"
    }
  }, SIZES.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSize(s),
    style: {
      height: 48,
      cursor: "pointer",
      background: "var(--canvas)",
      color: "var(--ink)",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--button-md-size)",
      fontWeight: 500,
      borderRadius: "var(--radius-pill)",
      border: s === size ? "1px solid var(--ink)" : "var(--border-hairline)",
      boxShadow: s === size ? "inset 0 0 0 1px var(--ink)" : "none"
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    disabled: !size,
    onClick: () => onAdded && onAdded(p)
  }, size ? "Add to Bag" : "Select a Size"), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex"
      }
    }, "\u2661")
  }, "Favourite")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--body-md-size)",
      lineHeight: "var(--body-md-lh)",
      color: "var(--text-body)"
    }
  }, "Built for wet rock and long descents. A 4mm lugged outsole holds the line on loose ground, and the waterproof membrane keeps the upper honest in weather."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--caption-md-size)",
      fontWeight: 500,
      color: "var(--success)"
    }
  }, "In stock \u2014 free standard delivery for members"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "View Product Details",
    defaultOpen: true
  }, "Waterproof engineered mesh upper \xB7 4mm multidirectional lugs \xB7 8mm heel-toe offset \xB7 285g (US 9)"), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Shipping & Returns"
  }, "Free standard delivery on orders over $50. Returns accepted within 60 days."), /*#__PURE__*/React.createElement(DisclosureRow, {
    label: "Reviews (24)"
  }, "Average 4.6 out of 5 across 24 reviews.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-section)"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "You Might Also Like"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--gap-grid)"
    }
  }, window.STOREFRONT.products.slice(1, 5).map(x => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: x.name
  }, x))))));
}
Object.assign(window, {
  ProductScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Shell.jsx
try { (() => {
const {
  UtilityBar,
  PrimaryNav,
  Footer
} = window.SubtleGradientDesignSystem_21f929;
function Shell({
  active,
  onNavigate,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(UtilityBar, null), /*#__PURE__*/React.createElement(PrimaryNav, {
    brand: "Subtle Gradient",
    items: window.STOREFRONT.nav,
    active: active,
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement("main", null, children), /*#__PURE__*/React.createElement(Footer, {
    columns: window.STOREFRONT.footer,
    fineprint: window.STOREFRONT.fineprint
  }));
}
function SectionHead({
  title,
  action,
  onAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginBottom: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--heading-family)",
      fontSize: "var(--heading-xl-size)",
      fontWeight: 500,
      lineHeight: "var(--heading-xl-lh)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontSize: "var(--link-md-size)",
      fontWeight: 500,
      textDecoration: "underline",
      textUnderlineOffset: 2,
      color: "var(--ink)"
    }
  }, action));
}
function Container({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-gutter)",
      ...style
    }
  }, children);
}
Object.assign(window, {
  Shell,
  SectionHead,
  Container
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
window.STOREFRONT = {
  nav: ["New & Featured", "Men", "Women", "Kids", "Performance", "Collections", "Sport"],
  products: [{
    name: "Trail Runner GTX",
    category: "Men's Trail Running Shoes",
    price: "$97.97",
    wasPrice: "$140",
    discount: "30% off",
    badge: "Just In",
    colors: ["#111111", "#0a7281", "#f5f5f5"],
    colorCount: "3 Colours"
  }, {
    name: "Ridge Pace 4",
    category: "Men's Trail Running Shoes",
    price: "$140",
    colors: ["#39393b", "#d6d1ff"],
    colorCount: "2 Colours"
  }, {
    name: "Summit Flyknit",
    category: "Men's Trail Running Shoes",
    price: "$180",
    badge: "Recycled Materials",
    colors: ["#f5f5f5", "#111111", "#ed1aa0"],
    colorCount: "3 Colours"
  }, {
    name: "Fell Runner Low",
    category: "Men's Trail Running Shoes",
    price: "$104.97",
    wasPrice: "$130",
    discount: "19% off",
    colors: ["#0a7281"],
    colorCount: "1 Colour"
  }, {
    name: "Scree GTX 2",
    category: "Men's Trail Running Shoes",
    price: "$160",
    colors: ["#111111", "#4b4b4d"],
    colorCount: "2 Colours"
  }, {
    name: "Ridge Pace Trail Vest",
    category: "Men's Running Vest",
    price: "$85",
    badge: "Coming Soon",
    colors: ["#111111"],
    colorCount: "1 Colour"
  }, {
    name: "Contour Long Sleeve",
    category: "Men's Dri-Weave Top",
    price: "$45",
    colors: ["#f5f5f5", "#39393b", "#beaffd"],
    colorCount: "3 Colours"
  }, {
    name: "Gradient Half-Zip",
    category: "Men's Running Midlayer",
    price: "$78.97",
    wasPrice: "$95",
    discount: "17% off",
    colors: ["#111111", "#ffb0dd"],
    colorCount: "2 Colours"
  }, {
    name: "Pace Short 5\"",
    category: "Men's Lined Running Shorts",
    price: "$40",
    colors: ["#111111", "#4b4b4d"],
    colorCount: "2 Colours"
  }],
  filters: [{
    title: "Gender",
    options: [{
      label: "Men"
    }, {
      label: "Women"
    }, {
      label: "Unisex"
    }]
  }, {
    title: "Surface",
    options: [{
      label: "Trail",
      count: 42
    }, {
      label: "Road",
      count: 88
    }, {
      label: "Track",
      count: 12
    }]
  }, {
    title: "Shop by Price",
    options: [{
      label: "Under $100",
      count: 24
    }, {
      label: "$100 - $150",
      count: 31
    }, {
      label: "Over $150",
      count: 18
    }]
  }, {
    title: "Colour",
    options: [{
      label: "Black",
      count: 36
    }, {
      label: "White",
      count: 21
    }, {
      label: "Multi",
      count: 9
    }]
  }, {
    title: "Technology",
    options: [{
      label: "Gore-Tex",
      count: 8
    }, {
      label: "Recycled Materials",
      count: 27
    }]
  }],
  categories: ["Tops & T-Shirts", "Shorts", "Hoodies & Pullovers", "Trousers & Tights", "Jackets", "Socks", "Accessories", "Sale"],
  sports: [{
    label: "Trail Running",
    note: "Runner on switchback trail"
  }, {
    label: "Training",
    note: "Athlete in gym, low key light"
  }, {
    label: "Football",
    note: "Boots on floodlit pitch"
  }, {
    label: "Basketball",
    note: "Court at dusk"
  }, {
    label: "Tennis",
    note: "Clay court, low sun"
  }],
  footer: [{
    title: "Resources",
    links: ["Find a Store", "Become a Member", "Running Shoe Finder", "Send Us Feedback"]
  }, {
    title: "Help",
    links: ["Get Help", "Order Status", "Delivery", "Returns", "Payment Options"]
  }, {
    title: "Company",
    links: ["About Us", "News", "Careers", "Investors", "Sustainability"]
  }, {
    title: "Promotions & Discounts",
    links: ["Student", "Military", "Teacher", "First Responders", "Birthday"]
  }],
  fineprint: ["© 2026 Subtle Gradient. All rights reserved.", "Guides", "Terms of Sale", "Terms of Use", "Privacy Policy", "Supply Chain Transparency"]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.CampaignTile = __ds_scope.CampaignTile;

__ds_ns.CategoryIconCard = __ds_scope.CategoryIconCard;

__ds_ns.MemberBenefitCard = __ds_scope.MemberBenefitCard;

__ds_ns.PriceRow = __ds_scope.PriceRow;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.DisclosureRow = __ds_scope.DisclosureRow;

__ds_ns.SearchPill = __ds_scope.SearchPill;

__ds_ns.SwatchDot = __ds_scope.SwatchDot;

__ds_ns.PhotoStage = __ds_scope.PhotoStage;

__ds_ns.FilterSidebar = __ds_scope.FilterSidebar;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.PrimaryNav = __ds_scope.PrimaryNav;

__ds_ns.SubNavStrip = __ds_scope.SubNavStrip;

__ds_ns.UtilityBar = __ds_scope.UtilityBar;

})();
