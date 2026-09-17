"""Build the multi-sheet cleaned workbook: summary, index, one sheet per store.

The shape follows the workbook the user assembles by hand — CLEAN DATA, INDEX,
SUMMARY, a sheet per customer with the months laid out side by side, then NOTES —
so the download drops straight into the place their old file occupied.
"""
from __future__ import annotations

from io import BytesIO

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

from .cleaner import cleaning_notes

# Quantity is split across these four columns by unit of measure, the way the
# hand-built workbook does it, so a carton count is never added to a piece count.
UOM_BUCKETS = ("CARTON", "UNIT", "PCS", "OTHER")

# Beyond this the workbook gets unwieldy and slow to open; the rest still appear
# in INDEX and in every total.
MAX_STORE_SHEETS = 80

_HEAD = Font(bold=True, color="FFFFFF", size=10)
_HEAD_FILL = PatternFill("solid", fgColor="1F2933")
_TITLE = Font(bold=True, size=14)
_SUB = Font(size=10, color="6B7280")
_BOLD = Font(bold=True)
_MONTH_FILL = PatternFill("solid", fgColor="E8EDF2")
_RULE = Border(bottom=Side(style="thin", color="C7CED6"))
_MONEY = "#,##0.00"
_QTY = "#,##0"
_FORBIDDEN = set("[]:*?/\\")


def uom_bucket(uom: str) -> str:
    """Which of the four quantity columns a unit of measure belongs in."""
    code = (uom or "").strip().upper().rstrip(".")
    if code.startswith("CTN") or code == "CARTON":
        return "CARTON"
    if code in ("UNIT", "UNT"):
        return "UNIT"
    if code in ("PCS", "PC", "PIECES", "PIECE"):
        return "PCS"
    return "OTHER"


def with_uom_columns(frame: pd.DataFrame) -> pd.DataFrame:
    """Add CARTON / UNIT / PCS / OTHER, each holding the quantity or zero."""
    out = frame.copy()
    quantity = pd.to_numeric(out.get("Quantity"), errors="coerce").fillna(0.0)
    source = out["UOM"] if "UOM" in out.columns else pd.Series("", index=out.index)
    bucket = source.fillna("").map(uom_bucket)
    for name in UOM_BUCKETS:
        out[name] = quantity.where(bucket == name, 0.0)
    out["_Quantity"] = quantity
    return out


def breakdown_by_uom(frame: pd.DataFrame, by: str) -> pd.DataFrame:
    """Quantity split by unit of measure plus amount, one row per group."""
    amount = pd.to_numeric(frame["Amount"], errors="coerce").fillna(0.0)
    return frame.assign(_Amount=amount).groupby(by, dropna=False).agg(
        QUANTITY=("_Quantity", "sum"),
        CARTON=("CARTON", "sum"),
        UNIT=("UNIT", "sum"),
        PCS=("PCS", "sum"),
        OTHER=("OTHER", "sum"),
        AMOUNT=("_Amount", "sum"),
    )


def month_label(month: str) -> str:
    """'2026-06' -> 'JUN 2026', matching the hand-built workbook."""
    try:
        return pd.Period(str(month), freq="M").strftime("%b %Y").upper()
    except Exception:
        return str(month or "")


def _safe_sheet_name(name: str, used: set[str]) -> str:
    """Excel allows 31 characters, forbids []:*?/\\ — and no duplicate names."""
    clean = "".join(" " if c in _FORBIDDEN else c for c in str(name or "SHEET")).strip()
    clean = (clean or "SHEET")[:31]
    candidate, n = clean, 2
    while candidate.upper() in used:
        suffix = f" ({n})"
        candidate, n = clean[: 31 - len(suffix)] + suffix, n + 1
    used.add(candidate.upper())
    return candidate


def _write_header(sheet, row: int, labels: list[str], start_col: int = 1) -> None:
    for offset, label in enumerate(labels):
        cell = sheet.cell(row=row, column=start_col + offset, value=label)
        cell.font, cell.fill = _HEAD, _HEAD_FILL
        cell.alignment = Alignment(horizontal="center", vertical="center")


def _widths(sheet, widths: dict[int, int]) -> None:
    for column, width in widths.items():
        sheet.column_dimensions[get_column_letter(column)].width = width


def _format(sheet, column: int, fmt: str, first_row: int = 2) -> None:
    for row in sheet.iter_rows(min_row=first_row, min_col=column, max_col=column):
        for cell in row:
            cell.number_format = fmt


# --- sheets --------------------------------------------------------------

CLEAN_HEADERS = [
    "MONTH", "DATE", "INVOICE NO", "CUSTOMER NAME", "OUTLET", "ITEM DESCRIPTIONS",
    "ITEM BRAND", "QUANTITY", "UOM", *UOM_BUCKETS, "UNIT PRICE", "AMOUNT",
]


def _clean_data_sheet(book: Workbook, frame: pd.DataFrame) -> None:
    sheet = book.create_sheet("CLEAN DATA")
    _write_header(sheet, 1, CLEAN_HEADERS)
    sheet.freeze_panes = "A2"
    for record in frame.to_dict("records"):
        sheet.append(
            [
                month_label(record.get("Month")),
                record.get("Date"),
                record.get("Invoice No"),
                record.get("OutletGroup"),
                record.get("Outlet"),
                record.get("Product"),
                record.get("Brand"),
                record.get("_Quantity"),
                record.get("UOM"),
                *[record.get(b) for b in UOM_BUCKETS],
                record.get("Unit Price"),
                record.get("Amount"),
            ]
        )
    _format(sheet, 2, "DD/MM/YYYY")
    for column in (8, 10, 11, 12, 13):
        _format(sheet, column, _QTY)
    for column in (14, 15):
        _format(sheet, column, _MONEY)
    _widths(sheet, {1: 11, 2: 11, 3: 12, 4: 26, 5: 16, 6: 44, 7: 12, 8: 10,
                    9: 7, 10: 10, 11: 10, 12: 9, 13: 9, 14: 11, 15: 14})


def _block(sheet, row: int, title: str, table: pd.DataFrame) -> int:
    """One SUMMARY block: a titled table with a TOTAL row. Returns the next row."""
    keys = ["QUANTITY", *UOM_BUCKETS, "AMOUNT"]
    _write_header(sheet, row, [title, "QUANTITY", *UOM_BUCKETS, "AMOUNT (RM)"])
    row += 1
    for name, values in table.iterrows():
        sheet.cell(row=row, column=1, value=str(name) if str(name) else "—")
        for offset, key in enumerate(keys):
            cell = sheet.cell(row=row, column=2 + offset, value=float(values[key]))
            cell.number_format = _MONEY if key == "AMOUNT" else _QTY
        row += 1
    total = sheet.cell(row=row, column=1, value="TOTAL")
    total.font, total.border = _BOLD, _RULE
    for offset, key in enumerate(keys):
        cell = sheet.cell(row=row, column=2 + offset, value=float(table[key].sum()))
        cell.font, cell.border = _BOLD, _RULE
        cell.number_format = _MONEY if key == "AMOUNT" else _QTY
    return row + 2


def _summary_sheet(book: Workbook, frame: pd.DataFrame, period: str) -> None:
    sheet = book.create_sheet("SUMMARY")
    sheet.cell(row=1, column=1, value=f"CLEANED INVOICE DATA — {period}").font = _TITLE
    row = 3

    by_month = breakdown_by_uom(frame, "Month")
    by_month.index = [month_label(m) for m in by_month.index]
    row = _block(sheet, row, "BY MONTH", by_month)

    row = _block(sheet, row, "BY ITEM BRAND",
                 breakdown_by_uom(frame, "Brand").sort_values("AMOUNT", ascending=False))

    by_store = breakdown_by_uom(frame, "OutletGroup").sort_values("AMOUNT", ascending=False)
    _block(sheet, row, f"TOP {min(15, len(by_store))} CUSTOMERS", by_store.head(15))

    _widths(sheet, {1: 34, 2: 12, 3: 12, 4: 12, 5: 10, 6: 10, 7: 16})


def _index_sheet(book: Workbook, by_store: pd.DataFrame, period: str, sheeted: set[str]) -> None:
    sheet = book.create_sheet("INDEX")
    sheet.cell(row=1, column=1, value="CUSTOMER SHEETS").font = _TITLE
    sheet.cell(row=2, column=1, value=period).font = _SUB
    _write_header(sheet, 4, ["CUSTOMER NAME", "ROWS", "AMOUNT (RM)", "OWN SHEET"])
    row = 5
    for name, values in by_store.iterrows():
        sheet.cell(row=row, column=1, value=str(name))
        sheet.cell(row=row, column=2, value=int(values["ROWS"])).number_format = _QTY
        sheet.cell(row=row, column=3, value=float(values["AMOUNT"])).number_format = _MONEY
        sheet.cell(row=row, column=4, value="Yes" if str(name) in sheeted else "—")
        row += 1
    _widths(sheet, {1: 40, 2: 10, 3: 18, 4: 11})


STORE_HEADERS = ["DATE", "OUTLET", "ITEM DESCRIPTIONS", "ITEM BRAND", "QUANTITY",
                 "UNIT PRICE", *UOM_BUCKETS, "AMOUNT"]


def _store_sheet(book: Workbook, name: str, rows: pd.DataFrame, used: set[str], period: str) -> None:
    """One customer, its months laid out left to right in their own column blocks."""
    sheet = book.create_sheet(_safe_sheet_name(name, used))
    sheet.cell(row=1, column=1, value=str(name)).font = _TITLE
    sheet.cell(row=2, column=1, value=f"Invoiced lines · {period}").font = _SUB

    width = len(STORE_HEADERS) + 1  # one blank spacer column between months
    for index, month in enumerate(sorted({m for m in rows["Month"] if m}) or [""]):
        start = 1 + index * width
        label = sheet.cell(row=4, column=start, value=month_label(month) or "ALL")
        label.font, label.fill = _BOLD, _MONTH_FILL
        _write_header(sheet, 5, STORE_HEADERS, start_col=start)

        month_rows = rows[rows["Month"] == month] if month else rows
        for offset, record in enumerate(month_rows.to_dict("records")):
            values = [
                record.get("Date"),
                record.get("Outlet"),
                record.get("Product"),
                record.get("Brand"),
                record.get("_Quantity"),
                record.get("Unit Price"),
                *[record.get(b) for b in UOM_BUCKETS],
                record.get("Amount"),
            ]
            for column, value in enumerate(values):
                cell = sheet.cell(row=6 + offset, column=start + column, value=value)
                if column == 0:
                    cell.number_format = "DD/MM/YYYY"
                elif column in (4, 6, 7, 8, 9):
                    cell.number_format = _QTY
                elif column in (5, 10):
                    cell.number_format = _MONEY

        total_row = 6 + len(month_rows)
        cell = sheet.cell(row=total_row, column=start, value="TOTAL")
        cell.font, cell.border = _BOLD, _RULE
        amount = pd.to_numeric(month_rows["Amount"], errors="coerce").fillna(0).sum()
        for column, value in ((4, month_rows["_Quantity"].sum()), (10, float(amount))):
            cell = sheet.cell(row=total_row, column=start + column, value=float(value))
            cell.font, cell.border = _BOLD, _RULE
            cell.number_format = _MONEY if column == 10 else _QTY

        _widths(sheet, {start: 11, start + 1: 16, start + 2: 42, start + 3: 12,
                        start + 4: 10, start + 5: 11, start + 6: 9, start + 7: 9,
                        start + 8: 8, start + 9: 8, start + 10: 14})
    sheet.freeze_panes = "A6"


def _notes_sheet(book: Workbook, frame: pd.DataFrame, store_count: int, sheeted: int,
                 scope: str = "") -> None:
    sheet = book.create_sheet("NOTES")
    rows = list(cleaning_notes(frame))
    rows[3:3] = [
        ("Customer sheets", f"{sheeted:,} of {store_count:,} customers have their own sheet."),
        ("Quantity columns", "CARTON / UNIT / PCS / OTHER split QUANTITY by its unit of measure,"),
        ("", "so a carton count is never added to a piece count."),
        ("Grouping", "Resolved from the Store Names and Branch Names keywords as they stood"),
        ("", "when this file was downloaded — edit a mapping and download again to see it."),
    ]
    if scope:
        rows[3:3] = [("Filtered to", scope)]
    for label, value in rows:
        sheet.append([label, value])
    for row in sheet.iter_rows(min_col=1, max_col=1):
        for cell in row:
            cell.font = _BOLD
    _widths(sheet, {1: 22, 2: 96})


def build_report_workbook(frame: pd.DataFrame, scope: str = "") -> bytes:
    """The full cleaned workbook: SUMMARY, INDEX, per-store sheets, CLEAN DATA, NOTES.

    `scope` names any filter the download was taken under, so a one-store file is
    never mistaken for the whole month.
    """
    book = Workbook()
    book.remove(book.active)

    if frame.empty:
        _write_header(book.create_sheet("CLEAN DATA"), 1, CLEAN_HEADERS)
        buffer = BytesIO()
        book.save(buffer)
        return buffer.getvalue()

    data = with_uom_columns(frame).sort_values(
        ["OutletGroup", "Month", "Date"], kind="stable", na_position="last"
    )
    months = sorted({m for m in data["Month"] if m})
    period = (f"{month_label(months[0])} – {month_label(months[-1])}" if len(months) > 1
              else month_label(months[0]) if months else "—")
    if scope:
        period = f"{period} · {scope}"

    by_store = breakdown_by_uom(data, "OutletGroup")
    by_store["ROWS"] = data.groupby("OutletGroup", dropna=False).size()
    by_store = by_store.sort_values("AMOUNT", ascending=False)

    _summary_sheet(book, data, period)
    used = {"SUMMARY", "INDEX", "CLEAN DATA", "NOTES"}
    sheeted: set[str] = set()
    for name in list(by_store.index)[:MAX_STORE_SHEETS]:
        _store_sheet(book, name, data[data["OutletGroup"] == name], used, period)
        sheeted.add(str(name))
    _index_sheet(book, by_store, period, sheeted)
    _clean_data_sheet(book, data)
    _notes_sheet(book, frame, len(by_store), len(sheeted), scope)

    # SUMMARY first, then INDEX, then the store sheets, CLEAN DATA and NOTES.
    order = {"SUMMARY": 0, "INDEX": 1}
    book._sheets.sort(key=lambda s: order.get(s.title, 2))

    buffer = BytesIO()
    book.save(buffer)
    return buffer.getvalue()
