"""Parse a paginated 'Invoice Listing' Excel export into a clean line-item table.

The raw export is an accounting report dumped to Excel, not a data table: filter
metadata, per-page company banners and repeated column headers are interleaved
with the actual invoice headers and line items. See spec section 2.
"""
from __future__ import annotations

import io
import re
import zipfile
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Iterable

import pandas as pd

BOOK_VIEWS_RE = re.compile(rb"<bookViews>.*?</bookViews>", re.DOTALL)

INVOICE_NO_RE = re.compile(r"^IV-\d+", re.IGNORECASE)
# Some headers lose the prefix and arrive as a bare number, so the document
# number alone cannot separate an invoice header from a line item's Seq.
DOC_NO_RE = re.compile(r"^(?:[A-Z]{2}-)?\d+$", re.IGNORECASE)
DATE_RANGE_RE = re.compile(
    r"from\s+(\d{1,2}/\d{1,2}/\d{4})\s+to\s+(\d{1,2}/\d{1,2}/\d{4})", re.IGNORECASE
)
# A Name cell that is really an internal branch code, e.g. "10068 AMPANG BARU".
NUMERIC_NAME_RE = re.compile(r"^\s*\d{3,}\b")
# Placeholder written into the Project column when there is no project.
PLACEHOLDER_RE = re.compile(r"^[-–—.]{2,}$")
# An account/customer code rather than a name, e.g. "300-M0181".
CODE_LIKE_RE = re.compile(r"^[A-Z0-9]{2,}[-/][A-Z0-9]+$", re.IGNORECASE)


def _s(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and pd.isna(value):
        return ""
    return str(value).strip()


def _num(value: Any) -> float | None:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = _s(value).replace(",", "").replace("RM", "").strip()
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def _is_seq(value: Any) -> bool:
    """True when column A holds a positive integer Seq (a line-item row)."""
    if isinstance(value, bool):
        return False
    if isinstance(value, (int, float)) and not pd.isna(value):
        return float(value) > 0 and float(value).is_integer()
    text = _s(value)
    return text.isdigit() and int(text) > 0


def _parse_date(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        return value
    text = _s(value)
    if not text:
        return None
    for fmt in ("%d/%m/%Y", "%d/%m/%y", "%Y-%m-%d", "%d-%m-%Y", "%d %b %Y"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


@dataclass
class ParseResult:
    """Everything the Upload & Clean screen needs to preview a file."""

    rows: list[dict] = field(default_factory=list)
    invoice_count: int = 0
    line_item_count: int = 0
    date_from: datetime | None = None
    date_to: datetime | None = None
    reported_range: tuple[str, str] | None = None
    raw_names: list[str] = field(default_factory=list)
    discarded_rows: int = 0
    continuation_rows: int = 0

    def to_frame(self) -> pd.DataFrame:
        return pd.DataFrame(self.rows)


def _detect_reported_range(frame: pd.DataFrame, scan_rows: int = 13) -> tuple[str, str] | None:
    """Read 'Date : From 1/1/2026 to 31/7/2026' out of the filter metadata block."""
    for _, row in frame.head(scan_rows).iterrows():
        joined = " ".join(_s(v) for v in row.tolist())
        match = DATE_RANGE_RE.search(joined)
        if match:
            return match.group(1), match.group(2)
    return None


def _as_bytes(source: Any) -> bytes | None:
    if isinstance(source, bytes):
        return source
    if hasattr(source, "read"):
        source.seek(0)
        return source.read()
    try:
        with open(source, "rb") as handle:
            return handle.read()
    except (OSError, TypeError):
        return None


def _drop_book_views(source: Any) -> io.BytesIO | None:
    """Strip <bookViews> from an xlsx so openpyxl will open it.

    Accounting systems that write OOXML through non-Microsoft libraries emit
    PascalCase attributes — WindowWidth where the schema says windowWidth — and
    openpyxl raises TypeError rather than ignoring them. The element only holds
    window geometry, so dropping it costs nothing and the cell data is untouched.
    """
    raw = _as_bytes(source)
    if not raw or not raw.startswith(b"PK"):
        return None
    try:
        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
            items = [(item, archive.read(item.filename)) for item in archive.infolist()]
    except zipfile.BadZipFile:
        return None

    patched = io.BytesIO()
    changed = False
    with zipfile.ZipFile(patched, "w", zipfile.ZIP_DEFLATED) as out:
        for item, data in items:
            if item.filename == "xl/workbook.xml":
                data, count = BOOK_VIEWS_RE.subn(b"", data)
                changed = changed or bool(count)
            out.writestr(item, data)
    if not changed:
        return None
    patched.seek(0)
    return patched


def _rewind(source: Any) -> Any:
    if hasattr(source, "seek"):
        source.seek(0)
    return source


def _read_workbook(source: Any, sheet_name: int | str) -> pd.DataFrame:
    """Read the sheet, tolerating exports written by non-Microsoft libraries.

    openpyxl validates workbook metadata strictly and raises TypeError on any
    attribute it does not recognise — PascalCase WindowWidth, a firstPageNo on
    the page setup, and so on. None of that touches the cell data. calamine
    ignores the metadata entirely, so it is tried first and openpyxl is the
    fallback for anything calamine cannot handle.
    """
    kwargs = dict(sheet_name=sheet_name, header=None, dtype=object)
    try:
        return pd.read_excel(_rewind(source), engine="calamine", **kwargs)
    except (ImportError, ValueError):
        pass

    try:
        return pd.read_excel(_rewind(source), **kwargs)
    except TypeError:
        repaired = _drop_book_views(source)
        if repaired is None:
            raise
        return pd.read_excel(repaired, **kwargs)


Cell = tuple[int, Any]


def _split_cells(cells: list[Any]) -> tuple[list[Cell], list[Cell], list[Cell]]:
    """Populated cells beyond column A, split into dates, numbers and text.

    Column positions vary between exports — the same report can put Name in
    column D or column G depending on how the sheet was laid out and merged —
    so fields are identified by what the cell contains, not where it sits.
    """
    populated = [(i, c) for i, c in enumerate(cells) if _s(c)][1:]
    dates = [(i, c) for i, c in populated if _parse_date(c) is not None]
    date_idx = {i for i, _ in dates}
    numbers = [(i, c) for i, c in populated if i not in date_idx and _num(c) is not None]
    number_idx = {i for i, _ in numbers}
    text = [(i, c) for i, c in populated if i not in date_idx and i not in number_idx]
    return dates, numbers, text


def _read_invoice_header(cells: list[Any]) -> tuple[datetime | None, str, str, float | None]:
    """(doc date, account code, raw customer name, invoice total)."""
    dates, numbers, text = _split_cells(cells)
    doc_date = _parse_date(dates[0][1]) if dates else None
    total = _num(numbers[-1][1]) if numbers else None

    code, raw_name = "", ""
    labels = [_s(v) for _, v in text]
    if len(labels) >= 2:
        code, raw_name = labels[0], labels[1]
    elif labels:
        # One label only — a code if it looks like one, otherwise the name.
        if CODE_LIKE_RE.match(labels[0]):
            code = labels[0]
        else:
            raw_name = labels[0]
    return doc_date, code, raw_name, total


def _read_line_item(cells: list[Any]) -> tuple[dict, int | None]:
    """Build a line item, and report which column held its description.

    Continuation rows repeat that column, so the caller needs it to recognise
    them without assuming a fixed layout.
    """
    _, numbers, text = _split_cells(cells)

    quantity = _num(numbers[0][1]) if numbers else None
    amount = _num(numbers[-1][1]) if numbers else None
    # Unit price sits between quantity and amount; absent when only two numbers.
    unit_price = _num(numbers[-2][1]) if len(numbers) >= 3 else None

    gl_code = _s(text[0][1]) if text else ""
    first_number_at = numbers[0][0] if numbers else None
    uom_idx = next(
        (i for i, _ in text if first_number_at is not None and i > first_number_at), None
    )
    uom = _s(dict(text).get(uom_idx, "")) if uom_idx is not None else ""

    # Whatever is left after the GL code, the UOM and the project placeholder.
    remaining = [
        (i, v)
        for i, v in text[1:]
        if i != uom_idx and not PLACEHOLDER_RE.match(_s(v))
    ]
    description_at, description = "", ""
    if remaining:
        description_at, description = max(remaining, key=lambda pair: len(_s(pair[1])))
        description = _s(description)

    line = {
        "Seq": int(float(_s(cells[0]))),
        "GL Code": gl_code,
        "Product": description,
        "Quantity": quantity,
        "UOM": uom,
        "Unit Price": unit_price,
        "Amount": amount,
    }
    return line, (description_at if remaining else None)


def parse_invoice_listing(source: str | bytes, sheet_name: int | str = 0) -> ParseResult:
    """Turn the raw export into one dict per line item, invoice context carried down."""
    frame = _read_workbook(source, sheet_name)
    result = ParseResult(reported_range=_detect_reported_range(frame))

    invoice_no = doc_date = code = raw_name = None
    invoice_total = None
    seen_invoices: set[str] = set()
    seen_names: dict[str, None] = {}
    previous_line: dict | None = None
    description_col: int | None = None
    # Continuations only ever follow their own line item. Tracking this stops the
    # item-summary block at the end of the report — which also has lone
    # description cells — from being stitched onto the last real invoice line.
    after_item = False

    for _, raw_row in frame.iterrows():
        cells = raw_row.tolist()
        populated = [i for i, c in enumerate(cells) if _s(c)]
        if not populated:
            continue

        first = cells[0]
        # Only invoice headers carry a document date; line items never do. That,
        # not the "IV-" prefix, is what reliably tells the two apart — the prefix
        # goes missing whenever the export writes the cell as a number.
        is_header = bool(DOC_NO_RE.match(_s(first))) and any(
            _parse_date(c) is not None for c in cells[1:] if _s(c)
        )

        if INVOICE_NO_RE.match(_s(first)) or is_header:
            invoice_no = _s(first)
            doc_date, code, raw_name, invoice_total = _read_invoice_header(cells)
            seen_invoices.add(invoice_no)
            if raw_name:
                seen_names.setdefault(raw_name, None)
            if doc_date:
                result.date_from = min(filter(None, [result.date_from, doc_date]))
                result.date_to = max(filter(None, [result.date_to, doc_date]))
            previous_line, after_item = None, False
            continue

        if _is_seq(first) and invoice_no:
            line, description_at = _read_line_item(cells)
            line.update(
                {
                    "Invoice No": invoice_no,
                    "Date": doc_date,
                    "Month": doc_date.strftime("%Y-%m") if doc_date else "",
                    "Code": code,
                    "Raw Name": raw_name,
                    "Invoice Total": invoice_total,
                }
            )
            result.rows.append(line)
            previous_line = line
            if description_at is not None:
                description_col = description_at
            after_item = True
            continue

        # Description continuation: the row directly below a line item carrying
        # nothing but the description cell. e.g. "350G X 12" under a long name.
        if after_item and previous_line is not None and populated == [description_col]:
            fragment = _s(cells[description_col])
            previous_line["Product"] = f"{previous_line['Product']} {fragment}".strip()
            result.continuation_rows += 1
            continue

        result.discarded_rows += 1
        previous_line, after_item = None, False

    result.invoice_count = len(seen_invoices)
    result.line_item_count = len(result.rows)
    result.raw_names = list(seen_names.keys())
    return result


def looks_like_code_name(name: str) -> bool:
    """True for Name cells that are really branch codes, e.g. '10068 AMPANG BARU'."""
    return bool(NUMERIC_NAME_RE.match(name or ""))


def suggest_name_groups(raw_names: Iterable[str]) -> dict[str, str]:
    """Draft Name->Group mappings by splitting on the chain separators in the data.

    'ECONSAVE - AMPANG BARU'                  -> 'ECONSAVE'
    'BORONG DIN AS CASH & CARRY (BAGAN SERAI)' -> 'BORONG DIN AS CASH & CARRY'
    'MYDIN MOHAMED HOLDINGS BHD'              -> 'MYDIN MOHAMED HOLDINGS BHD'

    A name with no branch suffix maps to itself. That collapses nothing and
    invents nothing, but it keeps names that are already canonical out of the
    unmapped pile, so what remains flagged is only what genuinely needs a
    decision — chiefly the numeric branch codes, which the Code layer resolves.

    These are suggestions for the Mapping Manager to present as a draft; the user
    corrects them rather than starting from an empty table.
    """
    suggestions: dict[str, str] = {}
    for name in raw_names:
        clean = _s(name)
        if not clean or looks_like_code_name(clean):
            continue
        parent = clean
        if " - " in clean:
            parent = clean.split(" - ", 1)[0]
        elif "(" in clean:
            parent = clean.split("(", 1)[0]
        parent = parent.strip(" -–,")
        suggestions[clean] = (parent or clean).upper()
    return suggestions
