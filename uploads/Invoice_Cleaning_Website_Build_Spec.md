# Build Spec — Invoice Data Cleaning & Reporting Website

Use this as the prompt/spec for the build (e.g. paste into Claude Code). It's written from the workflow doc, the two UI mockups embedded in it, and a direct inspection of the actual raw export and the actual target report — so the shapes below are real, not guessed.

## 1. What this app does

A single internal web app that takes a messy accounting-system "Invoice Listing" export (raw, one row per line-item, no real structure) and turns it into (a) a clean, analysis-ready sales table and (b) the same visual report format as `Yearly_Overview_Report.pdf` — bar charts by outlet, bar charts by product per outlet, and a donut chart of product contribution — all generated from whatever date range the user uploads, not hardcoded to Jan–Jul 2026.

Apply the existing design system already established for this project (component patterns, spacing, type scale, colors) to every screen below — this is a data tool, so lean on its flat cards, pill buttons, and hairline-divided tables rather than introducing new chrome.

## 2. The raw input format (confirmed from `IKA_IV_LISTING_JAN-JULY.xlsx`)

This is a paginated accounting report dumped straight to Excel, not a data table. One sheet, ~19,800 rows, structure repeats every "page":

| Rows | Content | Handling |
|---|---|---|
| 1–13 | Report filter metadata (`Date : From 1/1/2026 to 31/7/2026`, `Company : All`, etc.) | Discard. Optionally parse row 2 to auto-detect the report's date range. |
| Repeats every page | `COMPANY NAME (reg no)` + `Page X of 353` | Discard — this recurs dozens of times through the file, not just once. |
| Repeats every page | Column header row: `Doc. No / Doc. Date / Code / Name / Amount (RM)` | Discard — also recurs every page. |
| One per invoice | **Invoice header row**: `Doc. No` (e.g. `IV-13371`), `Doc. Date`, `Code` (outlet/invoice code, e.g. `300-M0181`), `Name` (raw outlet name as typed at time of sale), `Amount (RM)` (invoice total) | This is where outlet + date + invoice total come from. |
| Repeats per invoice | Line-item column header: `Seq / GL Code / Description / Project / Quantity / UOM / Unit Price / Amount (RM)` | Discard. |
| One per SKU | **Line-item row**: `Seq`, `GL Code`, `Description`, `Project` (`----`), `Quantity`, `UOM` (`CTN`/`CTNe`), `Unit Price`, `Amount (RM)` | This is the sellable data — one row per product per invoice. |
| Occasional | **Description continuation row** — a long product description overflows into the *next* row, appearing as a lone value in the Description column with every other column blank (e.g. `RASTO CARBONARA MUSHROOM PASTA SAUCE` on one row, `350G X 12` on the row directly below it) | Must be detected (row where only the Description-column cell is populated and it doesn't start a new Seq) and concatenated onto the previous line-item's description with a space. |

**Parsing rule of thumb:** a row is an invoice header if column A matches `^IV-\d+`. A row is a line-item if column A is a positive integer (`Seq`). Anything else (blank rows, repeated page headers, repeated column headers, filter metadata) is noise to strip.

### Known outlet-naming problems (must be solved by cleaning, not by the user pre-editing the file)

Confirmed from the data — the raw `Name` field is unreliable in two distinct ways:

1. **Same outlet, many raw spellings.** A single retail chain shows up under dozens of branch-suffixed names that all need to collapse to one canonical parent, e.g. every `ECONSAVE - <branch>` (`ECONSAVE - AMPANG BARU`, `ECONSAVE - BAGAN SERAI`, `ECONSAVE - BATU GAJAH`, …) and every `BORONG DIN AS CASH & CARRY (<branch>)` variant must map to one group name. This is exactly what the two-column mapping tool in the workflow doc's screenshots does: left column = every raw name as it literally appears in the data, right column = the canonical group it rolls up to.
2. **Name field replaced by an internal branch code.** For some invoices the `Name` cell isn't a store name at all — it's a numeric branch code plus a location fragment, e.g. `10068 AMPANG BARU`, `10088 BAGAN SERAI`, `10106 BATU GAJAH`, `10103 BANDAR SERI BOTANI` (950 of the 1,681 invoices sampled had this pattern). The `Code` column (`300-10042`, `300-M0181`, etc.) is the reliable key — per the workflow doc, some outlets can *only* be identified by decoding this invoice code (e.g. a code fragment like `SNWG` → `Senawang`, or `300-B0133` → `Bangi`), because the `Name` field for that invoice is missing or wrong entirely.

So the mapping system needs **two layers**, both user-editable and both keyed for reuse across future uploads:
- **Name → Group**: raw `Name` string → canonical outlet/chain name (handles case 1).
- **Code → Group**: `Code` prefix/fragment → canonical outlet name, used as a fallback when `Name` is missing, numeric-only, or not resolvable (handles case 2).

## 3. The target output (confirmed from `Yearly_Overview_Report.pdf`)

The cleaned data feeds three report sections, in this order, that the app must be able to render on-screen and export to PDF:

1. **Yearly Overview — Sales by Outlet.** One horizontal bar chart, outlets sorted descending by total sales, RM values labeled at the end of each bar. Page header states the total company-wide sales and the period covered.
2. **Product Sales per Outlet.** One horizontal bar chart per outlet, products sorted descending by sales value, chart title showing the outlet's total sales. Outlets with long product lists paginate (the source report shows "Page 1 of 3", "Page 2 of 3" for its largest outlet) — cap items per chart page (~20–24 bars) and paginate rather than shrinking bars to illegibility.
3. **Product Contribution to Total Sales.** One donut chart across the whole company, top ~25 products as named slices with a percentage legend, everything else rolled into a single "Others" slice. A companion **"Others" — Detailed Breakdown** donut expands that slice into its own top-N-plus-remainder breakdown, labeled with its RM value and % of total company-wide sales.

Every chart needs an exact-value tooltip/label (the source report labels every bar), and every section needs a CSV/XLSX export of its underlying table, per the workflow doc's requirement.

## 4. Pages / screens

### 4.1 Dashboard
Landing screen after login. Cards/sections for: upload status of the most recent raw file, quick links into Mapping Manager, Clean Data Table, and Reports, and a snapshot of company-wide totals for the most recently cleaned dataset (mirrors report section 1 at a glance).

### 4.2 Upload & Clean
- File drop zone accepting the raw `.xlsx` invoice listing export.
- After upload, show a preview of what was parsed: invoice count, line-item count, date range detected, distinct raw outlet names found, and how many of those raw names are **unmapped** (no Name→Group or Code→Group match yet) — surface this count prominently, since unmapped rows are exactly what silently corrupts totals.
- A **Clean** button that runs the parsing/mapping pipeline described in §2 and produces the clean table.
- Once clean, the resulting table is downloadable as CSV or XLSX (per the workflow doc's explicit requirement).

### 4.3 Mapping Manager (the "keyword" system)
Recreate the two-pane editor shown in the workflow doc's screenshots, extended to cover both mapping layers:
- **Name → Group tab**: left column "Raw name (as it appears in your data)", right column "Group (canonical outlet)". Add New / Edit Selected / Delete Selected actions. Pre-populate by clustering the raw names seen in the current upload (e.g. group anything sharing a `CHAIN - ` or `CHAIN (branch)` prefix as a starting suggestion) so the user is correcting a draft, not starting from zero.
- **Code → Group tab**: left column "Invoice code / fragment", right column "Canonical outlet", for the cases where the outlet can only be resolved from the `Code` column (e.g. `300-B0133 → Bangi`). Support both exact-code and prefix/fragment matching (e.g. a fragment like `SNWG` should match anywhere it appears in a code, per the doc's example).
- Mappings persist and apply automatically to future uploads — this table is the reusable "keyword" library the workflow doc asks for, not a one-off per file.
- Include a short inline **explanation panel** next to the mapping tool (the doc calls this out specifically as step 4's requirement) that plainly states, in the app itself: why outlet names need mapping, the difference between the two mapping types above, and worked examples using the two real cases from this dataset (`ECONSAVE - AMPANG BARU` → `ECONSAVE`; `10068 AMPANG BARU` with code `300-10042` → resolved via Code mapping).
- Any row that's still unresolved after both mapping layers should be visibly flagged in the Clean Data Table rather than silently dropped or silently left under its raw, uncorrected name.

### 4.4 Clean Data Table
Two view modes, matching the two mockups in the workflow doc:
- **All months view**: every cleaned line-item/invoice row across the full uploaded date range, with outlet (canonical), date, product, quantity, unit price, amount. Sortable/filterable by outlet and by month.
- **Outlet + Month view**: a picker (Outlet dropdown, Month dropdown — same shape as the "Generate Detailed Monthly Report" dialog in the workflow doc) that filters the table to one outlet's one month. A **Generate** action produces that filtered view/report, downloadable as CSV or XLSX.

### 4.5 Reports & Visualizations
Renders the three chart sections from §3, computed from the currently cleaned dataset:
- Sales by outlet (bar).
- Sales by product per outlet (bar, one per outlet, paginated as needed).
- Product contribution to total sales (donut) + Others breakdown (donut).
- Also compute and surface, since the workflow doc calls these out explicitly as required visualizations: best-selling outlet (overall and per month), best-selling product (overall and per outlet), best month company-wide, and total sales value for the period — these can live as summary stat cards above the charts rather than as separate chart types.
- Every visualization has a **Download as PDF** action (per the workflow doc), and every chart's underlying table has a CSV/XLSX export, consistent with §4.2 and §4.4.

## 5. Cleaning pipeline (implementation order)

1. Load the sheet; drop rows that are entirely blank.
2. Classify remaining rows: invoice header (`^IV-\d+` in col A), line item (integer `Seq` in col A), description-continuation (only the Description-column cell populated, previous row was a line item), or page/report noise (everything else — discard).
3. Stitch description-continuation rows onto the preceding line item's Description.
4. For each invoice header, carry `Doc. No`, `Doc. Date`, `Code`, raw `Name` forward onto every line item that follows until the next invoice header.
5. Resolve canonical outlet per invoice: try Name→Group mapping first; if no match (or `Name` looks numeric/code-like), try Code→Group mapping; if still unresolved, flag the row rather than guessing.
6. Output one clean row per line item: `Outlet (canonical)`, `Invoice No`, `Date`, `Month`, `Product`, `Quantity`, `UOM`, `Unit Price`, `Amount`, `Raw Name` (kept for audit/debugging), `Mapping Status` (mapped / unmapped-flagged).
7. Aggregate this clean table to produce every view in §3 and §4.

## 6. Tech notes

- Client-side or server-side Excel parsing both work; given file sizes here (~20k rows, single sheet), a browser-based parse (SheetJS) is viable if this stays a single-user internal tool, otherwise parse server-side and keep the UI thin.
- PDF export of charts: render charts as SVG/canvas and rasterize to PDF, matching the layout of the reference `Yearly_Overview_Report.pdf` (chart title with outlet + total, axis in RM, value labels on bars).
- Keep the Name→Group and Code→Group mapping tables as persistent, editable data (not baked into the parser), since new raw name variants will keep appearing in future monthly uploads.
