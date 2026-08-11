# Storefront UI kit

A click-through recreation of the four surfaces the source kit documents: a men's landing page, a trail-running listing (PLP), a footwear product page (PDP), and the membership page.

Open `index.html`. Navigation: "Men" → landing, any other nav label → listing, "Collections" → membership. Product cards open the PDP; pick a size to enable "Add to Bag".

| File | Surface |
|---|---|
| `Shell.jsx` | Utility bar + primary nav + footer chrome, plus `SectionHead` and `Container` helpers |
| `HomeScreen.jsx` | Campaign hero, Trending Now 4-up, Shop by Sport rail, 2-up editorial split, Latest in Clothing icon strip |
| `ListingScreen.jsx` | Sub-nav strip, 220px filter rail, applied-filter chips, 3-up product grid |
| `ProductScreen.jsx` | Thumbnail rail + square main image, colour/size pickers, price block, disclosure rows, recommendations |
| `MembershipScreen.jsx` | Membership hero, 3-up benefit tiles, FAQ accordion, join panel |
| `data.js` | Product, filter, category and footer copy |

All chrome comes from the design system bundle (`window.SubtleGradientDesignSystem_21f929`); nothing is re-implemented here.

**Photography:** the source kit shipped no image assets, so every photographic slot renders as a `PhotoStage` placeholder captioned with the shot that belongs there (e.g. "Runner on switchback trail"). Drop real imagery in and pass `image` to replace them.
