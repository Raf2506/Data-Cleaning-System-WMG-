Price line for product cards and PDP; the only place sale red appears in retail chrome.

```jsx
<PriceRow price="$140" />
<PriceRow price="$97.97" wasPrice="$140" discount="30% off" />
```

On sale, the current price goes `--sale`, the original is struck through in `--mute`, and the "% off" copy follows in `--sale`. No badge, no background.
