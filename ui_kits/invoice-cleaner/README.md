# Invoice Cleaning & Reporting — UI kit

Click-through recreation of the five screens in `uploads/Invoice_Cleaning_Website_Build_Spec.md`, built on this design system's tokens and components with the Archivo / Archivo Narrow pairing used by the workshop deck template.

Run `python app/server.py` and open <http://localhost:5000> — the Flask app serves
these screens and they read live data. Opening `index.html` off the filesystem
also works: the API calls fail, the kit falls back to the sample dataset in
`data.js`, and a banner says so.

| File | Screen |
|---|---|
| `AppChrome.jsx` | Sidebar, page header, stat card, panel, status tag, ghost button, select |
| `Charts.jsx` | Horizontal bar list, monthly column chart, donut with percentage legend |
| `DashboardScreen.jsx` | Totals snapshot, sales-by-outlet, latest upload, quick links, monthly bars |
| `UploadScreen.jsx` | Drop zone, parse preview counts, unmapped-name warning, Clean action, exports |
| `MappingScreen.jsx` | Name → Group and Code → Group tabs plus the inline explanation panel |
| `TableScreen.jsx` | All-months view and Outlet + Month generator, flagged unmapped rows |
| `ReportsScreen.jsx` | The three report sections, stat cards, per-outlet pagination, PDF action |
| `api.js` | Fetches from the Flask API and translates its responses into the screen shapes |
| `data.js` | Sample cleaned dataset — the offline fallback |

**Backend:** `app/` in this project.

The API and the screens do **not** share a vocabulary. The API returns pandas
column names — `line_items`, `by_outlet`, `[{Outlet, Amount, Share}]`, and
`period` as a `(min, max)` tuple. The screens read camelCase — `lineItems`,
`byOutlet`, `[{outlet, amount}]`, and `period` as a formatted string. Every
translation lives in `api.js`; add a key to `data.js` and you must add its
mapper there too.

`window.API.boot()` runs before the first render and overwrites `window.INVOICE`
with live data, so the screens themselves never call `fetch`. The exceptions are
the two places where fetching on demand is the point: per-outlet product charts
(Reports) and the outlet + month filter (Clean Data Table).
