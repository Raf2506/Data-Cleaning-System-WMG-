repo: Raf2506/Data-Cleaning-System-WMG-
branch: main

## Last sync

date: 2026-08-11T04:15:00Z

The repository is currently **empty** — no commits on `main`, so there was nothing to read or import. Everything below was authored in this project and is ready to be pushed as the repo's first commit.

### Updated in this project
- Added `app/` — Python cleaning backend (parser, two-layer mapping library, report aggregations, Flask API, tests).
- Added `ui_kits/invoice-cleaner/` — five-screen web UI built on this design system.
- No repository files were overwritten; the design system's existing screens are untouched.

## Screen map

| Project screen | Repo files |
|---|---|
| `ui_kits/invoice-cleaner/DashboardScreen.jsx` | `app/invoice_cleaner/reports.py` (summary_stats) |
| `ui_kits/invoice-cleaner/UploadScreen.jsx` | `app/invoice_cleaner/parser.py`, `app/server.py` (`/api/upload`, `/api/clean`) |
| `ui_kits/invoice-cleaner/MappingScreen.jsx` | `app/invoice_cleaner/mappings.py`, `app/server.py` (`/api/mappings`) |
| `ui_kits/invoice-cleaner/TableScreen.jsx` | `app/invoice_cleaner/cleaner.py`, `app/server.py` (`/api/table`, `/api/export`) |
| `ui_kits/invoice-cleaner/ReportsScreen.jsx` | `app/invoice_cleaner/reports.py`, `app/server.py` (`/api/reports`) |
