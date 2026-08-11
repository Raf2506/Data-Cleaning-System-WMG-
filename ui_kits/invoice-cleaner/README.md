# Invoice Cleaning & Reporting — UI kit

Click-through recreation of the five screens in `uploads/Invoice_Cleaning_Website_Build_Spec.md`, built on this design system's tokens and components with the Archivo / Archivo Narrow pairing used by the workshop deck template.

Open `index.html`. The left rail switches screens; Upload & Clean runs a fake clean, Mapping Manager switches mapping layers, Clean Data Table switches view modes, Reports pages through per-outlet charts.

| File | Screen |
|---|---|
| `AppChrome.jsx` | Sidebar, page header, stat card, panel, status tag, ghost button, select |
| `Charts.jsx` | Horizontal bar list, monthly column chart, donut with percentage legend |
| `DashboardScreen.jsx` | Totals snapshot, sales-by-outlet, latest upload, quick links, monthly bars |
| `UploadScreen.jsx` | Drop zone, parse preview counts, unmapped-name warning, Clean action, exports |
| `MappingScreen.jsx` | Name → Group and Code → Group tabs plus the inline explanation panel |
| `TableScreen.jsx` | All-months view and Outlet + Month generator, flagged unmapped rows |
| `ReportsScreen.jsx` | The three report sections, stat cards, per-outlet pagination, PDF action |
| `data.js` | Sample cleaned dataset — shapes match the Flask API responses exactly |

**Backend:** `app/` in this project. Swapping the sample data for live calls means replacing `window.INVOICE` with `fetch('/api/reports')` etc.; response shapes already line up.
