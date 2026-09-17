"""Run the full cleaning pipeline (spec section 5) and export the clean table."""
from __future__ import annotations

import re
from io import BytesIO
from pathlib import Path

import pandas as pd

from .mappings import MappingLibrary
from .parser import ParseResult, parse_invoice_listing, suggest_name_groups

CLEAN_COLUMNS = [
    "OutletGroup",
    "Outlet",
    "Invoice No",
    "Date",
    "Month",
    "Brand",
    "Product",
    "Quantity",
    "UOM",
    "Pack Type",
    "Unit Price",
    "Amount",
    "Code",
    "Raw Name",
    "Mapping Status",
]

# Brands are a leading token of the product description, but not always one
# word — "CIK SURI" and "TREVOR'S" would be cut wrongly by a naive split. The
# longest matching prefix wins, so a two-word brand beats a one-word one.
BRANDS = [
    "AGLIO ALIO",
    "CIK SURI",
    "TREVOR'S",
    "TREVOR",
    "SONGKHLA",
    "DUTCHLAND",
    "DUTCHDIP",
    "PAPADAM",
    "ESBERG",
    "RASTO",
    "MONTH",
    "MONT",
    "PUMP",
]

# Products that carry a different label but belong to a parent brand.
# PAPADAM is a Cik Suri line, so it reports under CIK SURI. The dispenser pumps
# are sold with the Mont syrups and report under MONT, as does the "MONTH"
# mis-key of that brand.
BRAND_ALIASES = {
    "PAPADAM": "CIK SURI",
    "TREVOR'S": "TREVOR",
    "PUMP": "MONT",
    "MONTH": "MONT",
}

# Unit-of-measure codes as the ERP writes them, and the word a reader expects.
# Anything unknown is passed through untouched rather than guessed at.
PACK_TYPES = {
    "CTN": "Carton",
    "CTN.": "Carton",
    "CARTON": "Carton",
    "UNIT": "Unit",
    "UNT": "Unit",
    "PCS": "Pieces",
    "PC": "Pieces",
    "PIECES": "Pieces",
    "PKT": "Packet",
    "PACK": "Packet",
    "BTL": "Bottle",
    "BOX": "Box",
    "BAG": "Bag",
    "OTR": "Outer",
    "ROLL": "Roll",
    "DOZ": "Dozen",
    "TIN": "Tin",
    "TUB": "Tub",
    "JAR": "Jar",
    "SET": "Set",
    "PAIL": "Pail",
    "DRM": "Drum",
    "CASE": "Case",
    "KG": "Kilogram",
    "GM": "Gram",
    "LTR": "Litre",
    "L": "Litre",
}

# Markers the sales team types into the description; they are not part of the
# product, and leaving them in splits one SKU into several chart rows.
_NOISE = re.compile(r"\*+\s*(?:FOC|F\.O\.C\.?|EXCHANGE|EXCH)\s*\**", re.I)
# A 99-Speedmart SKU number prefixed to the description.
_SKU_PREFIX = re.compile(r"^99\s+(?=[A-Z])")
# "250GX 24" — the pack count glued to the weight.
_GLUED_PACK = re.compile(r"(?<=\d[A-Z])(?=X\s*\d)", re.I)


def normalise_product(product: str) -> str:
    """Canonical form of a product description.

    The same SKU is typed several ways across a month of invoices — "250GX 24"
    for "250G X 24", "NACHOS" for "NACHO", a "**FOC**" marker appended. Each
    variant would otherwise be its own bar on the chart.
    """
    text = (product or "").upper()
    text = _NOISE.sub(" ", text)
    text = _SKU_PREFIX.sub("", text.strip())
    text = _GLUED_PACK.sub(" ", text)
    text = text.replace("NACHOS", "NACHO").replace("SAUCES", "SAUCE")
    return re.sub(r"\s+", " ", text).strip()


def detect_brand(product: str) -> str:
    """Leading brand token of a product description, or '' when none matches."""
    text = (product or "").strip().upper()
    for brand in sorted(BRANDS, key=len, reverse=True):
        if text.startswith(brand):
            return BRAND_ALIASES.get(brand, brand)
    return ""


def pack_type(uom: str) -> str:
    """Readable unit of measure — Carton, Unit, Pieces — for the clean table."""
    code = (uom or "").strip().upper().rstrip(".")
    return PACK_TYPES.get(code, (uom or "").strip())


def clean_dataframe(parsed: ParseResult, mappings: MappingLibrary) -> pd.DataFrame:
    """Steps 5–6: resolve the canonical outlet per row and emit the clean table."""
    records = []
    for row in parsed.rows:
        group, outlet, status = mappings.group_and_branch(
            row.get("Raw Name", ""), row.get("Code", "")
        )
        product = normalise_product(row.get("Product", ""))
        records.append(
            {
                "OutletGroup": group,
                "Outlet": outlet,
                "Invoice No": row.get("Invoice No"),
                "Date": row.get("Date"),
                "Month": row.get("Month"),
                "Brand": detect_brand(product) or "Unbranded",
                "Product": product,
                "Quantity": row.get("Quantity"),
                "UOM": row.get("UOM"),
                "Pack Type": pack_type(row.get("UOM", "")),
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


def cleaning_notes(frame: pd.DataFrame) -> list[tuple[str, str]]:
    """The audit trail that ships with the workbook: what was done, and to how much."""
    total = float(frame["Amount"].sum()) if not frame.empty else 0.0
    status = frame["Mapping Status"].value_counts().to_dict() if not frame.empty else {}
    months = sorted({m for m in frame.get("Month", pd.Series(dtype=str)) if m}) if not frame.empty else []
    return [
        ("Rows in cleaned table", f"{len(frame):,}"),
        ("Total amount (RM)", f"{total:,.2f}"),
        ("Period", f"{months[0]} to {months[-1]}" if months else "—"),
        ("", ""),
        ("Extraction", "Invoice header rows supply Invoice No, Date, Code and Name;"),
        ("", "detail rows supply Product, Quantity, UOM, Unit Price and Amount."),
        ("", "Descriptions wrapped across two rows by the report width are re-joined."),
        ("", "Repeated page headers, footers and report parameter blocks are removed."),
        ("", ""),
        ("OutletGroup", f"From the Store Names keywords ({status.get('mapped', 0):,} rows)."),
        ("", f"A customer matching no keyword is cleaned into its own store "
             f"({status.get('auto', 0):,} rows): legal suffixes (SDN BHD, BERHAD, S/B)"),
        ("", "and bracketed registration numbers removed."),
        ("Outlet", "From the Branch Names keywords, then a branch carried in the name"),
        ("", "(brackets, 'c/o ...', 'CAWANGAN ...'), then the account code."),
        ("Product", "Upper-cased, '**FOC**' and '**EXCHANGE' markers removed, pack format"),
        ("", "normalised ('250GX 24' -> '250G X 24'), NACHOS -> NACHO, SAUCES -> SAUCE."),
        ("Brand", "Read from the leading words of the product description."),
        ("", "PAPADAM reports under CIK SURI; PUMP and MONTH report under MONT."),
        ("Pack Type", "Readable unit of measure: CTN -> Carton, PCS -> Pieces, and so on."),
        ("Excluded rows", f"{status.get('excluded', 0):,} — customers sent to \"(exclude)\" in the Mapping Manager."),
        ("Reconciliation", "The sum of Amount equals the sum of the source line items to the cent."),
    ]


def to_xlsx_bytes(frame: pd.DataFrame, sheet_name: str = "Clean Data") -> bytes:
    """The clean table plus a NOTES sheet recording how it was produced."""
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
        frame.to_excel(writer, index=False, sheet_name=sheet_name[:31])
        notes = pd.DataFrame(cleaning_notes(frame), columns=["", ""])
        notes.to_excel(writer, index=False, header=False, sheet_name="NOTES")

        # Default column widths cut every product description in half.
        sheet = writer.sheets[sheet_name[:31]]
        for column in frame.columns:
            longest = max(
                [len(str(column))] + [len(str(v)) for v in frame[column].head(500)]
            )
            letter = sheet.cell(row=1, column=list(frame.columns).index(column) + 1).column_letter
            sheet.column_dimensions[letter].width = min(max(longest + 2, 10), 48)
        writer.sheets["NOTES"].column_dimensions["A"].width = 22
        writer.sheets["NOTES"].column_dimensions["B"].width = 96
    return buffer.getvalue()
