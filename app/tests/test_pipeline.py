import io
import zipfile

import pandas as pd

from invoice_cleaner import MappingLibrary, clean_dataframe, parse_invoice_listing
from invoice_cleaner.parser import suggest_name_groups


def _fixture() -> io.BytesIO:
    """A miniature of the real export: metadata, page noise, headers, continuations."""
    rows = [
        ["Invoice Listing", None, None, None, None, None, None, None],
        ["Date : From 1/1/2026 to 31/7/2026", None, None, None, None, None, None, None],
        ["Company : All", None, None, None, None, None, None, None],
        ["ACME FOODS SDN BHD (123456-A)", None, None, None, None, None, None, None],
        ["Page 1 of 353", None, None, None, None, None, None, None],
        ["Doc. No", "Doc. Date", "Code", "Name", "Amount (RM)", None, None, None],
        ["IV-13371", "05/01/2026", "300-M0181", "ECONSAVE - AMPANG BARU", 1500.0, None, None, None],
        ["Seq", "GL Code", "Description", "Project", "Quantity", "UOM", "Unit Price", "Amount (RM)"],
        [1, "500-000", "RASTO CARBONARA MUSHROOM PASTA SAUCE", "----", 10, "CTN", 90.0, 900.0],
        [None, None, "350G X 12", None, None, None, None, None],
        [2, "500-000", "RASTO TOMATO BASIL", "----", 10, "CTN", 60.0, 600.0],
        ["ACME FOODS SDN BHD (123456-A)", None, None, None, None, None, None, None],
        ["Page 2 of 353", None, None, None, None, None, None, None],
        ["Doc. No", "Doc. Date", "Code", "Name", "Amount (RM)", None, None, None],
        ["IV-13372", "07/02/2026", "300-10042", "10068 AMPANG BARU", 400.0, None, None, None],
        ["Seq", "GL Code", "Description", "Project", "Quantity", "UOM", "Unit Price", "Amount (RM)"],
        [1, "500-000", "RASTO TOMATO BASIL", "----", 5, "CTN", 80.0, 400.0],
    ]
    buffer = io.BytesIO()
    pd.DataFrame(rows).to_excel(buffer, index=False, header=False)
    buffer.seek(0)
    return buffer


def test_pipeline():
    parsed = parse_invoice_listing(_fixture())
    assert parsed.invoice_count == 2
    assert parsed.line_item_count == 3
    assert parsed.reported_range == ("1/1/2026", "31/7/2026")
    assert parsed.continuation_rows == 1
    # Continuation row was stitched onto the previous description.
    assert parsed.rows[0]["Product"].endswith("350G X 12")

    suggestions = suggest_name_groups(parsed.raw_names)
    assert suggestions["ECONSAVE - AMPANG BARU"] == "ECONSAVE"

    m = MappingLibrary()
    m.merge_suggestions(suggestions)
    m.set_code("300-10042", "ECONSAVE", exact=True)

    frame = clean_dataframe(parsed, m)
    assert set(frame["Outlet"]) == {"ECONSAVE"}
    assert set(frame["Mapping Status"]) == {"mapped-name", "mapped-code"}
    assert frame["Amount"].sum() == 1900.0


def test_unmapped_is_flagged_not_dropped():
    parsed = parse_invoice_listing(_fixture())
    frame = clean_dataframe(parsed, MappingLibrary())
    assert len(frame) == 3
    assert "unmapped" in set(frame["Mapping Status"])


def _pascal_case_book_views(source: io.BytesIO) -> io.BytesIO:
    """Rewrite workbookView attributes the way non-Microsoft exporters do."""
    out = io.BytesIO()
    with zipfile.ZipFile(source) as zin, zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "xl/workbook.xml":
                data = data.replace(
                    b"<workbookView ",
                    b'<workbookView WindowWidth="28800" WindowHeight="12435" ',
                )
            zout.writestr(item, data)
    out.seek(0)
    return out


def test_pascalcase_workbook_attributes_are_repaired():
    """AutoCount-style exports use WindowWidth, not windowWidth; openpyxl refuses them."""
    broken = _pascal_case_book_views(_fixture())

    # Confirm the fixture really does break the underlying reader.
    broken.seek(0)
    try:
        pd.read_excel(broken, header=None, dtype=object)
        raise AssertionError("expected openpyxl to reject PascalCase attributes")
    except TypeError:
        pass

    broken.seek(0)
    parsed = parse_invoice_listing(broken)
    assert parsed.invoice_count == 2
    assert parsed.line_item_count == 3
    assert parsed.reported_range == ("1/1/2026", "31/7/2026")


if __name__ == "__main__":
    test_pipeline()
    test_unmapped_is_flagged_not_dropped()
    test_pascalcase_workbook_attributes_are_repaired()
    print("ok")
