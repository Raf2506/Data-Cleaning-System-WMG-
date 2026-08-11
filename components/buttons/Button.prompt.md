The universal pill CTA — every actionable surface in the system uses it; there is no square button.

```jsx
<Button variant="primary">Notify Me</Button>
<Button variant="secondary">Discover More</Button>
<Button variant="onImage" size="sm">Shop</Button>
```

Variants: `primary` (ink, one per viewport), `secondary` (soft-cloud, the low-emphasis partner), `onImage` (white pill anchored bottom-left of photography). Sizes `lg` / `md` / `sm`. Pressing collapses the pill to `scale(0.5)` at `opacity 0.5` — the system's signature tap feedback; don't replace it with a hover color change.
