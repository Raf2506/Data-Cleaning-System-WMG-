# Subtle Gradient Design System

A photography-first commerce design system. Everything chromatic belongs to the imagery; the chrome is pure black, pure white, one surface gray, and a very small semantic set. The signature is extreme typographic contrast — a 96px uppercase display lockup set into full-bleed campaign photography, sitting above a dense 16px catalog of pill CTAs, hairline dividers, and flat, zero-radius product cards.

## Source

Built entirely from one supplied file:

- `uploads/Subtle-Gradient-Design-System_1.md` — a design.md-format spec (front-matter tokens for colors, typography, radius, spacing, and 30 component entries; prose sections for layout, elevation, shapes, components, do's and don'ts, responsive behavior, known gaps).

No codebase, Figma file, screenshots, image assets, font binaries, or logo were provided. Nothing in this system is inferred from any other source. Where the spec is silent (hover states, dialogs, checkout forms, bag/wishlist overlays — see its own "Known Gaps"), this system is silent too rather than inventing behaviour.

The brief that accompanied the upload described the company as "DataCleaning Design System", which does not match the uploaded spec's content in any way. The spec is a retail/athletic commerce system, and the spec won — it is the only concrete material. Say the word if this should be rebranded.

## Products

The spec documents a single product surface, a commerce storefront, across five templates: a gendered landing page, a trail-running listing (PLP), a footwear product page (PDP), a membership page, and a performance sub-line landing page. `ui_kits/storefront/` recreates four of these; the sub-line landing page reuses the landing composition with different photography and is not duplicated.

## Content fundamentals

Copy is short, athletic, and declarative. Imperatives carry the editorial moments; plain nouns carry the chrome.

- **Voice:** second person, addressed to the shopper — "Become a member", "Select Size", "Find a Store". Never first person, never "we"; the brand does not talk about itself in the UI.
- **Casing:** Title Case for nav, section headers, and CTAs ("Featured Footwear", "Add to Bag", "Shop by Sport"). Uppercase only for the display tier, which is set uppercase by the typography token, not by the writer. Sentence case for body copy and disclosure content.
- **Length:** display lockups run one to three words ("Hold the line", "Pace"). CTAs are one to three words ("Shop", "Join Us", "Notify Me"). Product names are literal ("Trail Runner GTX"); category subtitles are fully qualified ("Men's Trail Running Shoes").
- **Numbers:** counts sit in parentheses after a label — "Reviews (24)", "Trail (42)". Prices carry the currency symbol and no space; discounts read "30% off", lowercase.
- **No emoji, ever.** Not in UI copy, not in marketing copy. The system has no decorative glyph vocabulary.
- **No exclamation marks, no hype adjectives, no wordplay.** "Free standard delivery on orders over $50" — a fact, delivered flat.
- **Utility copy is terse and separated by pipes or middots:** "Find a Store | Help | Join Us | Sign In", breadcrumbs as "Men / Shoes / Trail Running".
- **Vibe:** a printed catalog written by athletes. Kinetic in the headline, procedural everywhere else.

## Visual foundations

**Color.** `--ink` (#111111), `--canvas` (#ffffff), and `--soft-cloud` (#f5f5f5) carry roughly 95% of chrome surface area. Text steps down ink → charcoal → ash → mute → stone. `--sale` (#d30005) appears on price rows only — never as a background or badge fill. Category accents (pink, purple, teal) are restricted to swatch dots, soft editorial tile fills, and lockup accents; they are never chrome and never text.

**Type.** Two tiers with nothing between them. Anton at 96px, line-height 0.9, uppercase, for campaign lockups on photography only. Inter Display 500 at 32/24/16px for headings; Inter 400/500 at 16/14/12px for everything else, plus a 9px legal row. Letter-spacing stays at 0 throughout — both faces are cut for tight optical fit.

**Spacing and layout.** 8px base. Major blocks stack at 48px (32px tablet, 24px mobile). Product grids tile at 8px gutters with zero card padding. Content max-width ~1440px; outer gutters grow to ~80px at 1920px rather than stretching. PLP filter rail is a fixed 220px, collapsing to a "Hide Filters" toggle, then an off-canvas drawer. Whitespace separates, it does not decorate — headlines sit immediately below the divider above them.

**Backgrounds.** No gradients, no textures, no patterns, no illustration washes. Backgrounds are either `--canvas`, `--soft-cloud`, or a photograph. Campaign heroes are full-bleed cinematic crops (16:9 desktop, art-directed to 4:5 on mobile); product photography is 1:1 (or 4:5 on tall crops) shot on flat `--soft-cloud`, which is the system's studio.

**Imagery vibe.** Editorial and physical: real athletes mid-effort, available light, cool-neutral grade, no color casts pushed for mood, no grain treatment. Product still life is neutral and shadowless on gray. Nothing is composited or illustrated except the small category icons in the clothing strip.

**Borders, shadows, elevation.** There is no drop-shadow elevation anywhere in the retail chrome. Three levels only: flat (the default), a 1px `--hairline` divider (filter rows, footer, PDP disclosure rows), and `inset 0 -1px 0 --hairline-soft` on sticky bars and tab strips. Cards do not lift.

**Corner radii and card anatomy.** Containers are 0px — cards, tiles, imagery, nav, footer. 18px only for avatar/icon containers in member lockups. 24px for the search pill. 30px for every CTA pill. Fully round for swatch dots and 40px icon buttons. A product card therefore is: full-bleed photograph, no border, no shadow, no radius, no padding — then swatch dots, name, category, colour count, price, each 8px apart.

**Transparency and blur.** None. There is no glass, no scrim, no protection gradient. Legibility on photography is solved by art direction and by choosing the headline color per asset (`--canvas` or `--ink`), plus the crisp white on-image pill.

**Animation and states.** Motion is limited to press feedback. The signature is the tap collapse: `scale(0.5)` at `opacity 0.5` for the duration of the press, on pills and icon buttons alike. Hover states are deliberately undocumented in the source, so this system ships none — do not add color-darkening hovers. Selection states are absolute flips, not shades: filter chips invert to solid ink, filter rail options gain a 1px ink underline, the active nav section gains a 2px ink underline, swatch dots gain a concentric ink ring. Focus is one effect only: canvas fill, 2px ink border, 12px `--soft-cloud` halo.

**Fixed elements.** The utility bar and primary nav sit at the top of every page; the PLP sub-nav strip is sticky with its inset hairline. Nothing else is pinned — no floating action button, no sticky add-to-bag on desktop.

## Iconography

No icon assets were supplied. **Lucide** (MIT, 2px stroke, round caps) stands in as the closest match to the spec's described chrome icons — magnifier, chevrons, heart, bag, share, sliders, carousel paddles. This is a substitution; flag it if the real set differs.

- Loaded from CDN: `https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js`. `components/core/Icon.jsx` wraps it.
- Icons are monochrome and inherit text color — `--ink` on light, `--canvas` on ink. Never tinted, never filled, never mixed stroke weights.
- Size is 20px inline, 22–24px in the nav cluster, always inside a 40px circular `IconButton` when interactive.
- No emoji and no unicode dingbats are used as icons anywhere in the system.
- Category illustrations in the "Latest in Clothing" strip are raster/vector artwork in the real product; none was supplied, so `CategoryIconCard` renders a captioned placeholder.

## Font substitutions

- **Anton** — available on Google Fonts, loaded as specified.
- **Inter** — available on Google Fonts, loaded at weights 400/500/600.
- **Inter Display** — *not* publicly available. Substituted with Inter at optical size 32 (`--font-display-tuned` + `font-variation-settings:'opsz' 32`), which is the closest reachable cut. **Please send the real Inter Display binaries if you have them** and this becomes exact.
- **Noto Sans Arabic** — loaded for RTL locales as specified; no Arabic layouts are built here.

## Assets

`assets/` is empty. No logo, wordmark, photography, or illustration was supplied, and none has been drawn or reconstructed. Wherever a mark belongs, the brand name is set in plain type in the display face (see `guidelines/brand-wordmark.html` and `PrimaryNav`'s `brand` prop). Wherever a photograph belongs, `PhotoStage` renders a soft-cloud placeholder captioned with the shot that goes there.

## Index

Root files:

- `styles.css` — the entry point consumers link. `@import` lines only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `shape.css`, `elevation.css`, `motion.css`, `base.css`.
- `guidelines/` — 19 foundation specimen cards (Colors, Type, Spacing, Shape, Brand).
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent Skills entry point.
- `uploads/Subtle-Gradient-Design-System_1.md` — the source spec.

Components (`window.SubtleGradientDesignSystem_21f929.<Name>`):

- `components/buttons/` — **Button**, **IconButton**, **FilterChip**
- `components/forms/` — **SearchPill**, **SwatchDot**
- `components/cards/` — **ProductCard**, **CampaignTile**, **CategoryIconCard**, **MemberBenefitCard**, **Badge**, **PriceRow**
- `components/navigation/` — **UtilityBar**, **PrimaryNav**, **SubNavStrip**, **FilterSidebar**, **Footer**
- `components/disclosure/` — **DisclosureRow**
- `components/core/` — **Icon**
- `components/media/` — **PhotoStage**

UI kits:

- `ui_kits/storefront/` — landing, listing, PDP, membership; see its README.

### Intentional additions

Two components have no direct entry in the source spec:

- **Icon** — a wrapper for the substituted Lucide set, so glyph size and stroke stay consistent.
- **PhotoStage** — the photography frame. The spec describes photography geometry precisely (1:1, 4:5, 16:9, staged on soft-cloud) but shipped no images; this component holds that geometry and captions the empty state instead of faking a picture.

Every other component maps one-to-one onto a `components:` entry in the source front matter. Variants in the spec (`-active`, `-focused`, `button-outline-on-image`, `badge-sale-text`, `faq-row`) are props on their parent component rather than separate exports.

### Not built (absent from the source)

Dialogs and modals beyond the geo-selector pair, bag and wishlist overlays, login and checkout forms, and bag-count icon badges. The source lists these as known gaps; they were not invented here.
