# Data Cleaning System (WMG)

Turns a paginated accounting **Invoice Listing** Excel export into a clean,
analysis-ready line-item table, then aggregates it into sales reports — replacing
the manual export → spreadsheet → pivot workflow.

The repository holds three layers:

| Layer | Path | What it is |
|---|---|---|
| Backend | [`app/`](app/) | Python parsing/cleaning pipeline and Flask API |
| Frontend | [`ui_kits/invoice-cleaner/`](ui_kits/invoice-cleaner/) | Five-screen web UI (currently on sample data) |
| Design system | [`docs/design-system.md`](docs/design-system.md), `tokens/`, `components/`, `guidelines/` | The Subtle Gradient design system the UI is built on |

## Running it

```bash
pip install -r app/requirements.txt
python app/server.py            # http://localhost:5000
```

`localhost:5000` serves the UI kit and the API together — upload an Invoice
Listing export on **Upload & Clean** and every screen switches to your data.

Tests need `app/` on the import path:

```bash
PYTHONPATH=app python app/tests/test_pipeline.py
```

The UI kit also opens standalone (`ui_kits/invoice-cleaner/index.html`): the API
calls fail, it falls back to the sample dataset in `data.js`, and it says so.

## How the cleaning works

The raw export interleaves invoice headers, line items, wrapped description
rows, and page furniture. The parser classifies every row and keeps only what
carries data:

- **Invoice header** — column A matches `^IV-\d+`
- **Line item** — column A is a positive integer `Seq`
- **Description continuation** — only the Description cell is populated, directly
  after a line item; concatenated onto the previous product name
- Everything else is discarded as report noise

Invoice context (date, outlet, invoice number) is carried down onto each line
item, and the reported date range is auto-detected from the file — never
hardcoded.

**Outlet resolution** runs through a persistent keyword library. A **Store name**
keyword matching the invoice name or code sets the `OutletGroup` (`ST` → SRI
TERNAK), and a **Branch name** keyword sets the `Outlet`.

A customer that matches no keyword is **not dropped**. Its store name is derived
from the invoice name itself — legal suffixes (`SDN BHD`, `BERHAD`, `S/B`) and
bracketed registration numbers removed, any branch lifted out of the brackets,
`c/o ...` or `CAWANGAN ...` — and the row is flagged `auto`. That is what lets a
first upload from a company with an empty keyword list produce a full clean
table; add a keyword afterwards when several of those should group as one store.

Two rules sit alongside that. A customer named only by an internal number and a
place — `10058 KLEBANG`, `10106 BATU GAJAH` — is an **ECONSAVE** outlet, and the
place becomes the branch. And Branch name keywords apply only to customers the
Store name keywords recognise, so a rule written for one chain's branch (`CASH &
CARRY` for Borong Din) cannot rename an unrelated customer's outlet.

To keep an account out of the figures, point a Store name keyword at
`(exclude)`; those rows are flagged `excluded` and left out of every total. Every
clean row carries `Raw Name` and `Mapping Status` for audit.

**The cleaned workbook** (`Cleaned XLSX` on Reports and Upload) is the download
meant for circulating, not just for re-importing:

- `SUMMARY` — by month, by item brand and the top 15 customers, each with the
  quantity split across CARTON / UNIT / PCS / OTHER and the amount
- `INDEX` — every customer with its row count, value, and whether it has a sheet
- one **sheet per customer**, with each month in its own block of columns side by
  side, dated, and totalled
- `CLEAN DATA` — the flat table, month and date first
- `NOTES` — what the cleaning did

Quantities are never added across units of measure: a carton count and a piece
count sit in separate columns, and the Reports page shows them as separate
figures for the same reason.

**Products** are normalised so one SKU stays one SKU: upper-cased, `**FOC**` and
`**EXCHANGE` markers removed, `250GX 24` → `250G X 24`, `NACHOS` → `NACHO`. The
unit of measure is carried through raw (`UOM`) and as a word (`Pack Type`:
Carton, Unit, Pieces, Outer, …).

The mapping library is saved as JSON under `app/data/`, so corrections made in
one month's upload carry forward to the next.

## API

| Endpoint | Purpose |
|---|---|
| `POST /api/upload` | Parse and return preview counts + unmapped names, without cleaning |
| `POST /api/clean` | Run the pipeline, cache the clean frame, return summary stats |
| `GET`/`POST /api/mappings` | Read or edit the two mapping layers |
| `GET /api/table` | Clean rows, filterable by outlet and month |
| `GET /api/reports` | Sales by outlet, product contribution, "Others" breakdown, monthly totals |
| `GET /api/reports/outlet/<outlet>` | Per-outlet product sales, paginated at 24 bars |
| `GET /api/export/<csv\|xlsx>` | Download the clean table, one flat sheet |
| `GET /api/export/report` | The multi-sheet cleaned workbook (below) |

Module-level detail is in [`app/README.md`](app/README.md); the screen-to-endpoint
map is in [`ui_kits/invoice-cleaner/README.md`](ui_kits/invoice-cleaner/README.md).

The API speaks pandas column names and the screens speak camelCase;
[`ui_kits/invoice-cleaner/api.js`](ui_kits/invoice-cleaner/api.js) is the only
place that knows both.

## A note on the design system

`docs/design-system.md` documents **Subtle Gradient**, a photography-first
commerce design system. It was generated from a supplied spec
(`uploads/Subtle-Gradient-Design-System_1.md`) whose content is a retail/athletic
storefront, not an invoice tool — the mismatch is called out in that document's
own Source section. It is included here because the invoice-cleaner UI is built
on its tokens and components. `ui_kits/storefront/` is the design system's
original demo surface and is unrelated to invoice cleaning.
