"""Run the full cleaning pipeline (spec section 5) and export the clean table."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pandas as pd

from .mappings import MappingLibrary
from .parser import ParseResult, parse_invoice_listing, suggest_name_groups

CLEAN_COLUMNS = [
    "Outlet",
    "Invoice No",
    "Date",
    "Month",
    "Product",
    "Quantity",
    "UOM",
    "Unit Price",
    "Amount",
    "Code",
    "Raw Name",
    "Mapping Status",
]


def clean_dataframe(parsed: ParseResult, mappings: MappingLibrary) -> pd.DataFrame:
    """Steps 5–6: resolve the canonical outlet per row and emit the clean table."""
    records = []
    for row in parsed.rows:
        outlet, status = mappings.resolve(row.get("Raw Name", ""), row.get("Code", ""))
        records.append(
            {
                "Outlet": outlet,
                "Invoice No": row.get("Invoice No"),
                "Date": row.get("Date"),
                "Month": row.get("Month"),
                "Product": row.get("Product"),
                "Quantity": row.get("Quantity"),
                "UOM": row.get("UOM"),
                "Unit Price": row.get("Unit Price"),
                "Amount": row.get("Amount"),
                "Code": row.get("Code"),
                "Raw Name": row.get("Raw Name"),
                "Mapping Status": status,
            }
        )
    frame = pd.DataFrame(records, columns=CLEAN_COLUMNS)
    if not frame.empty:
        frame["Date"] = pd.to_datetime(frame["Date"], errors="coerce")
    return frame


def clean_file(
    source: str | bytes | Path,
    mapping_path: str | Path = "data/mappings.json",
    seed_suggestions: bool = False,
) -> tuple[pd.DataFrame, ParseResult, MappingLibrary]:
    """Parse, optionally seed draft mappings, then clean. The one-call entry point."""
    parsed = parse_invoice_listing(source)
    mappings = MappingLibrary.load(mapping_path)
    if seed_suggestions:
        mappings.merge_suggestions(suggest_name_groups(parsed.raw_names))
        mappings.save(mapping_path)
    return clean_dataframe(parsed, mappings), parsed, mappings


def to_csv_bytes(frame: pd.DataFrame) -> bytes:
    return frame.to_csv(index=False).encode("utf-8-sig")


def to_xlsx_bytes(frame: pd.DataFrame, sheet_name: str = "Clean Data") -> bytes:
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
        frame.to_excel(writer, index=False, sheet_name=sheet_name[:31])
    return buffer.getvalue()
