import io
import zipfile
from datetime import datetime

import pandas as pd

from invoice_cleaner import MappingLibrary, clean_dataframe, parse_invoice_listing
from invoice_cleaner.cleaner import detect_brand
from invoice_cleaner.parser import suggest_name_groups


def test_papadam_reports_under_cik_suri():
    assert detect_brand("PAPADAM SURI BULAT 100G X 10's X 20") == "CIK SURI"
    assert detect_brand("CIK SURI ASAM JAWA 900G") == "CIK SURI"
    assert detect_brand("TREVOR'S CREAMY HONEY BLEND") == "TREVOR"
    assert detect_brand("RASTO NACHO CHEESE SAUCE") == "RASTO"


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
    # ECONSAVE must be a Store Name for its rows to be in scope.
    m.set_store("ECONSAVE", "ECONSAVE")

    frame = clean_dataframe(parsed, m)
    assert set(frame["OutletGroup"]) == {"ECONSAVE"}
    assert frame["Amount"].sum() == 1900.0


def test_rows_without_a_store_are_out_of_scope():
    """No Store Name matches — the rows are dropped from scope, not renamed."""
    parsed = parse_invoice_listing(_fixture())
    frame = clean_dataframe(parsed, MappingLibrary())
    assert len(frame) == 3  # still present in the audit table
    assert set(frame["Mapping Status"]) == {"out-of-scope"}
    assert set(frame["OutletGroup"]) == {MappingLibrary.OUT_OF_SCOPE}


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


def test_store_matches_by_code_prefix_for_unnamed_accounts():
    """IKA-style: the export never names the chain, so a code fragment does it."""
    m = MappingLibrary(chain_keywords={"300-10": "ECONSAVE"})
    assert m.store_of("10068 AMPANG BARU", "300-10042") == "ECONSAVE"
    group, _, _ = m.group_and_branch("10068 AMPANG BARU", "300-10042")
    assert group == "ECONSAVE"


def test_clean_frame_carries_outlet_group():
    parsed = parse_invoice_listing(_fixture())
    m = MappingLibrary(chain_keywords={"ECONSAVE": "ECONSAVE"})
    m.merge_suggestions(suggest_name_groups(parsed.raw_names))
    m.set_code("300-10042", "ECONSAVE", exact=True)
    frame = clean_dataframe(parsed, m)
    assert "OutletGroup" in frame.columns
    assert set(frame["OutletGroup"]) == {"ECONSAVE"}


def test_chain_name_in_raw_gives_group_with_code_as_branch():
    """The SOON CHEONG case: chain named, branch not — group it, branch by code."""
    m = MappingLibrary(chain_keywords={"SOON CHEONG": "SOON CHEONG"})
    group, branch, status = m.group_and_branch("SOON CHEONG MARINE PRODUCT SDN BHD KL", "300-S0256")
    assert group == "SOON CHEONG"
    assert branch == "300-S0256"  # no outlet named, so the code stands in
    assert status == "mapped-group"


def test_store_in_name_wins_the_group_branch_only_labels():
    """ST ROSYAM MART (SEMENYIH) is SRI TERNAK's Semenyih branch."""
    m = MappingLibrary(chain_keywords={"ST": "SRI TERNAK"})
    m.set_code("SEMENYIH", "SEMENYIH")  # a Branch Outlet rule, not a store
    group, branch, _ = m.group_and_branch("ST ROSYAM MART (SEMENYIH)", "300-S0215")
    assert group == "SRI TERNAK"
    assert branch == "SEMENYIH"


def test_no_store_means_out_of_scope():
    m = MappingLibrary(chain_keywords={"ST": "SRI TERNAK"})
    group, _, status = m.group_and_branch("AEON (KL RDC)", "300-A0118")
    assert group == MappingLibrary.OUT_OF_SCOPE
    assert status == "out-of-scope"
    # Adding AEON as a store brings it into scope.
    m.set_store("AEON", "AEON")
    assert m.group_and_branch("AEON (KL RDC)", "300-A0118")[0] == "AEON"


def test_chain_keyword_tolerates_plural_but_not_a_longer_word():
    m = MappingLibrary(chain_keywords={"CS BROTHER": "CS BROTHER", "ST": "SRI TERNAK"})
    assert m.chain_in_name("CS BROTHERS SDN BHD") == "CS BROTHER"
    assert m.chain_in_name("STAR GROCER SDN BHD") == ""  # ST must not leak into STAR


def test_store_with_a_named_branch():
    m = MappingLibrary(chain_keywords={"SOON CHEONG": "SOON CHEONG"})
    m.set_code("SG BULOH", "SG BULOH")
    group, branch, _ = m.group_and_branch("SOON CHEONG SG BULOH", "300-S0257")
    assert (group, branch) == ("SOON CHEONG", "SG BULOH")


def test_plain_names_map_to_themselves():
    """A name with no branch suffix is canonical already — not 'unmapped'."""
    suggestions = suggest_name_groups(["MYDIN MOHAMED HOLDINGS BHD", "ECONSAVE - AMPANG BARU"])
    assert suggestions["MYDIN MOHAMED HOLDINGS BHD"] == "MYDIN MOHAMED HOLDINGS BHD"
    assert suggestions["ECONSAVE - AMPANG BARU"] == "ECONSAVE"


def _tidy_fixture() -> io.BytesIO:
    """A clean one-row-per-line-item export under a real header row."""
    rows = [
        ["DocNo", "DocDate", "Code", "Name", "InvoiceAmount", "Seq", "GLCode",
         "Description", "Project", "Quantity", "UOM", "UnitPrice", "LineAmount"],
        ["IV-16481", "2026-07-01", "300-10025", "10026 BUTTERWORTH", 396.26, 1000,
         "500-000", "RASTO NACHO CHEESE SAUCE 1KG X 20", "----", 1, "CTN", 179.82, 171.26],
        ["IV-16481", "2026-07-01", "300-10025", "10026 BUTTERWORTH", 396.26, 2000,
         "500-000", "RASTO CHILI SAUCE 1KG X 20", "----", 3, "CTN", 75, 225],
        ["IV-16494", "2026-07-03", "300-S0205", "ST ROSYAM MART (SHAH ALAM)", 102.86, 1000,
         "500-000", "CIK SURI ASAM JAWA XTRA 200G x 36", "----", 1, "CTN", 108, 102.86],
    ]
    buffer = io.BytesIO()
    pd.DataFrame(rows).to_excel(buffer, index=False, header=False)
    buffer.seek(0)
    return buffer


def test_tidy_table_is_parsed_by_column_name():
    parsed = parse_invoice_listing(_tidy_fixture())
    assert parsed.invoice_count == 2
    assert parsed.line_item_count == 3
    assert parsed.discarded_rows == 0
    first = parsed.rows[0]
    assert first["Invoice No"] == "IV-16481"
    assert first["Code"] == "300-10025"
    assert first["Product"] == "RASTO NACHO CHEESE SAUCE 1KG X 20"
    assert first["Amount"] == 171.26  # LineAmount, not InvoiceAmount
    assert first["Quantity"] == 1


def test_month_is_read_from_the_dates_not_a_metadata_block():
    """The tidy export has no 'Date : From ... to ...' header — dates carry it."""
    parsed = parse_invoice_listing(_tidy_fixture())
    assert {r["Month"] for r in parsed.rows} == {"2026-07"}
    assert parsed.date_from.date().isoformat() == "2026-07-01"
    assert parsed.date_to.date().isoformat() == "2026-07-03"


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
    test_papadam_reports_under_cik_suri()
    test_rows_without_a_store_are_out_of_scope()
    test_tidy_table_is_parsed_by_column_name()
    test_month_is_read_from_the_dates_not_a_metadata_block()
    test_wide_layout_is_parsed_by_content_not_position()
    test_header_without_iv_prefix_is_not_read_as_a_line_item()
    test_trailing_summary_block_is_not_stitched()
    test_undetected_outlet_falls_back_to_the_invoice_code()
    test_keyword_matches_name_or_code_longest_first()
    test_store_matches_by_code_prefix_for_unnamed_accounts()
    test_clean_frame_carries_outlet_group()
    test_chain_name_in_raw_gives_group_with_code_as_branch()
    test_store_in_name_wins_the_group_branch_only_labels()
    test_no_store_means_out_of_scope()
    test_chain_keyword_tolerates_plural_but_not_a_longer_word()
    test_store_with_a_named_branch()
    test_plain_names_map_to_themselves()
    test_pascalcase_workbook_attributes_are_repaired()
    print("ok")
