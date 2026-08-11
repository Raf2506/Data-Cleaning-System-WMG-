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
DATE_RANGE_RE = re.compile(
    r"from\s+(\d{1,2}/\d{1,2}/\d{4})\s+to\s+(\d{1,2}/\d{1,2}/\d{4})", re.IGNORECASE
)
# A Name cell that is really an internal branch code, e.g. "10068 AMPANG BARU".
NUMERIC_NAME_RE = re.compile(r"^\s*\d{3,}\b")

DESCRIPTION_COL = 2  # 0-indexed column holding 'Description' on line-item rows.


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


def _read_workbook(source: Any, sheet_name: int | str) -> pd.DataFrame:
    try:
        return pd.read_excel(source, sheet_name=sheet_name, header=None, dtype=object)
    except TypeError:
        repaired = _drop_book_views(source)
        if repaired is None:
            raise
        return pd.read_excel(repaired, sheet_name=sheet_name, header=None, dtype=object)


def parse_invoice_listing(source: str | bytes, sheet_name: int | str = 0) -> ParseResult:
    """Turn the raw export into one dict per line item, invoice context carried down."""
    frame = _read_workbook(source, sheet_name)
    result = ParseResult(reported_range=_detect_reported_range(frame))

    invoice_no = doc_date = code = raw_name = None
    invoice_total = None
    seen_invoices: set[str] = set()
    seen_names: dict[str, None] = {}
    previous_line: dict | None = None

    for _, raw_row in frame.iterrows():
        cells = raw_row.tolist()
        if all(not _s(c) for c in cells):
            continue

        first = cells[0]

        if INVOICE_NO_RE.match(_s(first)):
            invoice_no = _s(first)
            doc_date = _parse_date(cells[1] if len(cells) > 1 else None)
            code = _s(cells[2]) if len(cells) > 2 else ""
            raw_name = _s(cells[3]) if len(cells) > 3 else ""
            invoice_total = _num(cells[4]) if len(cells) > 4 else None
            seen_invoices.add(invoice_no)
            if raw_name:
                seen_names.setdefault(raw_name, None)
            if doc_date:
                result.date_from = min(filter(None, [result.date_from, doc_date]))
                result.date_to = max(filter(None, [result.date_to, doc_date]))
            previous_line = None
            continue

        if _is_seq(first) and invoice_no:
            description = _s(cells[DESCRIPTION_COL]) if len(cells) > DESCRIPTION_COL else ""
            line = {
                "Invoice No": invoice_no,
                "Date": doc_date,
                "Month": doc_date.strftime("%Y-%m") if doc_date else "",
                "Code": code,
                "Raw Name": raw_name,
                "Seq": int(float(_s(first))),
                "GL Code": _s(cells[1]) if len(cells) > 1 else "",
                "Product": description,
                "Quantity": _num(cells[4]) if len(cells) > 4 else None,
                "UOM": _s(cells[5]) if len(cells) > 5 else "",
                "Unit Price": _num(cells[6]) if len(cells) > 6 else None,
                "Amount": _num(cells[7]) if len(cells) > 7 else None,
                "Invoice Total": invoice_total,
            }
            result.rows.append(line)
            previous_line = line
            continue

        # Description continuation: only the Description cell carries a value and
        # the row directly above was a line item. e.g. "350G X 12" under a long name.
        if previous_line is not None and len(cells) > DESCRIPTION_COL:
            populated = [i for i, c in enumerate(cells) if _s(c)]
            if populated == [DESCRIPTION_COL]:
                fragment = _s(cells[DESCRIPTION_COL])
                previous_line["Product"] = f"{previous_line['Product']} {fragment}".strip()
                result.continuation_rows += 1
                continue

        result.discarded_rows += 1

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
        if parent and parent != clean:
            suggestions[clean] = parent.upper()
    return suggestions
