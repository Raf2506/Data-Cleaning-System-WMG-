# Invoice Cleaning & Reporting — Python backend

Turns a paginated accounting "Invoice Listing" Excel export into a clean, analysis-ready line-item table, then aggregates it into the three report sections.

```
pip install -r requirements.txt
python server.py                        # serves the API and the UI kit
PYTHONPATH=. python tests/test_pipeline.py
```

`server.py` serves the repo root as its static root and redirects `/` to
`/ui_kits/invoice-cleaner/index.html`, so the UI kit's relative asset paths
(`../../styles.css`, `../../_ds_bundle.js`) resolve without a build step.

## Modules

| File | Role |
|---|---|
| `invoice_cleaner/parser.py` | Classifies every raw row (invoice header / line item / description continuation / page noise), stitches wrapped descriptions, carries invoice context down onto line items, auto-detects the reported date range |
| `invoice_cleaner/mappings.py` | The persistent two-layer mapping library: `Name → Group` and `Code → Group` (exact or fragment match), saved as JSON so it carries across monthly uploads |
| `invoice_cleaner/cleaner.py` | Runs the pipeline end to end and exports CSV / XLSX |
| `invoice_cleaner/reports.py` | Sales by outlet, product sales per outlet (paginated at 24 bars), product contribution donut, "Others" breakdown, monthly totals, summary stats |
| `server.py` | Flask API: `/api/upload`, `/api/clean`, `/api/mappings`, `/api/table`, `/api/reports`, `/api/export/<csv\|xlsx>` |

## Cleaning rules

- Invoice header: column A matches `^IV-\d+`. Line item: column A is a positive integer `Seq`. Everything else is discarded as report noise.
- A row where **only** the Description cell is populated, directly after a line item, is a wrapped description — concatenated onto the previous product name.
- Outlet resolution order: `Name → Group`, then `Code → Group` when the Name is missing or numeric (`10068 AMPANG BARU`). Still unresolved rows are kept and flagged `unmapped` — never dropped, never silently renamed.
- Every clean row carries `Raw Name` and `Mapping Status` for audit.

Date ranges are read from the file, never hardcoded.
