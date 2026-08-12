import io
import zipfile
from datetime import datetime

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


def _wide_fixture() -> io.BytesIO:
    """The real export's layout: 16 columns, fields spread by merged cells.

    Invoice fields land in 0/2/4/6/15 and line items in 0/1/3/8/10/11/12/13 —
    nothing like the narrow fixture above. Both must parse identically.
    """
    def row(pairs):
        cells = [None] * 16
        for index, value in pairs:
            cells[index] = value
        return cells

    rows = [
        row([(0, "Date"), (1, ":"), (2, "From 1/1/2026 to 31/7/2026")]),
        row([(0, "WEST MALAYAN GROUP SDN BHD"), (15, "Page 1 of 2")]),
        row([(0, "Doc. No"), (2, "Doc. Date"), (4, "Code"), (7, "Name"), (15, "Amount (RM)")]),
        row([(0, "IV-13371"), (2, datetime(2026, 1, 2)), (4, "300-M0181"),
             (6, "MYDIN MOHAMED HOLDINGS BHD"), (15, 2880.0)]),
        row([(0, "Seq"), (1, "GL Code"), (3, "Description"), (8, "Project"),
             (10, "Quantity"), (11, "UOM"), (12, "Unit Price"), (13, "Amount (RM)")]),
        row([(0, 1000), (1, "500-000"), (3, "RASTO GARLIC SPREAD BUTTER 200G X"), (8, "----"),
             (10, 10), (11, "CTN"), (12, 192.0), (13, 1920.0)]),
        row([(3, "24")]),
        row([(0, 2000), (1, "500-000"), (3, "RASTO MAYO GARLIC 250G X 24"), (8, "----"),
             (10, 5), (11, "CTN"), (12, 192.0), (13, 960.0)]),
        # Header that lost its "IV-" prefix because the cell was written as a number.
        row([(0, 16812), (2, datetime(2026, 7, 20)), (4, "300-N0115"),
             (6, "NSK GROCER (KL) SDN. BHD."), (15, 75.89)]),
        row([(0, "Seq"), (1, "GL Code"), (3, "Description"), (8, "Project"),
             (10, "Quantity"), (11, "UOM"), (12, "Unit Price"), (13, "Amount (RM)")]),
        row([(0, 1000), (1, "500-000"), (3, "CIK SURI ASAM JAWA XTRA 200G x 24"), (8, "----"),
             (10, 1), (11, "CTN"), (12, 79.68), (13, 75.89)]),
        # Item-summary block that closes the report: lone description cells here
        # must NOT be stitched onto the last invoice line.
        row([(1, "CSAJ200Gx24"), (3, "CIK SURI ASAM JAWA XTRA 200G x"), (7, 279), (8, "CTN"), (10, 19211.52)]),
        row([(3, "24")]),
        row([(14, "Total Item(s) :"), (15, 113)]),
    ]
    buffer = io.BytesIO()
    pd.DataFrame(rows).to_excel(buffer, index=False, header=False)
    buffer.seek(0)
    return buffer


def test_wide_layout_is_parsed_by_content_not_position():
    parsed = parse_invoice_listing(_wide_fixture())
    assert parsed.invoice_count == 2
    assert parsed.line_item_count == 3
    assert parsed.reported_range == ("1/1/2026", "31/7/2026")

    first = parsed.rows[0]
    assert first["Invoice No"] == "IV-13371"
    assert first["Raw Name"] == "MYDIN MOHAMED HOLDINGS BHD"
    assert first["Code"] == "300-M0181"
    assert first["Quantity"] == 10
    assert first["UOM"] == "CTN"
    assert first["Unit Price"] == 192.0
    assert first["Amount"] == 1920.0
    # Continuation stitched despite the description sitting in column D.
    assert first["Product"] == "RASTO GARLIC SPREAD BUTTER 200G X 24"


def test_header_without_iv_prefix_is_not_read_as_a_line_item():
    parsed = parse_invoice_listing(_wide_fixture())
    assert "16812" in {r["Invoice No"] for r in parsed.rows}
    # Its line belongs to it, not to the invoice above.
    orphaned = [r for r in parsed.rows if r["Invoice No"] == "IV-13371"]
    assert sum(r["Amount"] for r in orphaned) == 2880.0


def test_trailing_summary_block_is_not_stitched():
    parsed = parse_invoice_listing(_wide_fixture())
    last = parsed.rows[-1]
    assert last["Product"] == "CIK SURI ASAM JAWA XTRA 200G x 24"
    assert parsed.continuation_rows == 1  # only the real one, not the summary's


def test_undetected_outlet_falls_back_to_the_invoice_code():
    """No name rule, no keyword rule — label by the code, and keep it flagged."""
    library = MappingLibrary()
    outlet, status = library.resolve("10094 KUBANG KERIAN", "300-10075")
    assert outlet == "300-10075"
    assert status == "unmapped"

    # With no code at all there is nothing better than the raw name.
    assert library.resolve("SOME GROCER", "") == ("SOME GROCER", "unmapped")


def test_keyword_matches_name_or_code_longest_first():
    library = MappingLibrary()
    library.set_code("KLUANG", "KLUANG")
    library.set_code("KLUANG PERDANA", "KLUANG PERDANA")
    library.set_code("SNWG", "SENAWANG")

    assert library.resolve("10043 KLUANG PERDANA", "300-1")[0] == "KLUANG PERDANA"
    assert library.resolve("10043 KLUANG", "300-1")[0] == "KLUANG"
    # Matched through the code rather than the name.
    assert library.resolve("10101 SD/CR", "300-SNWG01")[0] == "SENAWANG"


def test_outlet_group_from_chain_map_else_branch():
    library = MappingLibrary(branch_to_chain={"SENAWANG": "SRI TERNAK"})
    assert library.chain_of("SENAWANG") == "SRI TERNAK"
    # A branch with no chain entry is its own group — how the big chains behave.
    assert library.chain_of("LOTUSS STORES") == "LOTUSS STORES"


def test_clean_frame_carries_outlet_group():
    parsed = parse_invoice_listing(_fixture())
    m = MappingLibrary(branch_to_chain={"ECONSAVE": "ECONSAVE GROUP"})
    m.merge_suggestions(suggest_name_groups(parsed.raw_names))
    m.set_code("300-10042", "ECONSAVE", exact=True)
    frame = clean_dataframe(parsed, m)
    assert "OutletGroup" in frame.columns
    assert set(frame["OutletGroup"]) == {"ECONSAVE GROUP"}


def test_plain_names_map_to_themselves():
    """A name with no branch suffix is canonical already — not 'unmapped'."""
    suggestions = suggest_name_groups(["MYDIN MOHAMED HOLDINGS BHD", "ECONSAVE - AMPANG BARU"])
    assert suggestions["MYDIN MOHAMED HOLDINGS BHD"] == "MYDIN MOHAMED HOLDINGS BHD"
    assert suggestions["ECONSAVE - AMPANG BARU"] == "ECONSAVE"


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
    test_wide_layout_is_parsed_by_content_not_position()
    test_header_without_iv_prefix_is_not_read_as_a_line_item()
    test_trailing_summary_block_is_not_stitched()
    test_undetected_outlet_falls_back_to_the_invoice_code()
    test_keyword_matches_name_or_code_longest_first()
    test_outlet_group_from_chain_map_else_branch()
    test_clean_frame_carries_outlet_group()
    test_plain_names_map_to_themselves()
    test_pascalcase_workbook_attributes_are_repaired()
    print("ok")
