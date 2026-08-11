Every photograph in the system sits on a PhotoStage — square for product, 4:5 for rail tiles, 16:9 for campaign heroes.

```jsx
<PhotoStage ratio="1/1" note="Product on soft-cloud studio" />
<PhotoStage src="/assets/hero.jpg" ratio="16/9" alt="Runner on trail" />
```

Intentional addition: the source kit shipped no imagery, so the placeholder state keeps layouts honest about where photography goes. Never add padding around it and never round its corners — product imagery is full-bleed at `--radius-none`.
