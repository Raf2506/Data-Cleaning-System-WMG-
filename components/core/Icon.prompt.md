Renders a single Lucide glyph at a fixed pixel box; use it anywhere the chrome needs an icon (nav cluster, search pill, chevrons, carousel paddles).

```jsx
<Icon name="search" size={20} color="var(--ink)" />
```

Requires the Lucide UMD script on the page (`https://unpkg.com/lucide@0.469.0/dist/umd/lucide.js`). Keep `strokeWidth` at 2 — the system never mixes stroke weights. Icons are always `--ink` on light surfaces and `--canvas` on `--ink` surfaces; never colored.
