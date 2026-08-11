The 220px left rail on listing pages: grouped filter options separated by hairline dividers.

```jsx
<FilterSidebar groups={[{ title: "Surface", options: [{ label: "Trail", count: 42 }] }]}
  selected={["Trail"]} onToggle={toggle} />
```

Group headers in 16px medium ink, options in 14px with mute counts in parentheses. Applied filters get a 1px ink underline — no checkbox, no fill.
