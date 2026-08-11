"""Flask API for the invoice cleaning UI. Thin: all logic lives in invoice_cleaner."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, request, send_file, send_from_directory

from invoice_cleaner import (
    MappingLibrary,
    clean_dataframe,
    parse_invoice_listing,
    reports,
    suggest_name_groups,
    to_csv_bytes,
    to_xlsx_bytes,
)

BASE = Path(__file__).parent
DATA = BASE / "data"
MAPPING_PATH = DATA / "mappings.json"
CLEAN_PATH = DATA / "clean.parquet"

app = Flask(__name__, static_folder=str(BASE / "static"), static_url_path="")


def _clean_frame() -> pd.DataFrame:
    if CLEAN_PATH.exists():
        return pd.read_parquet(CLEAN_PATH)
    return pd.DataFrame()


def _store(frame: pd.DataFrame) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    frame.to_parquet(CLEAN_PATH, index=False)


@app.get("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.post("/api/upload")
def upload():
    """Parse the raw export and return the preview counts, without cleaning yet."""
    file = request.files["file"]
    parsed = parse_invoice_listing(BytesIO(file.read()))
    mappings = MappingLibrary.load(MAPPING_PATH)
    codes = {r["Raw Name"]: r["Code"] for r in parsed.rows}
    unmapped = mappings.unmapped_names(parsed.raw_names, codes)
    return jsonify(
        {
            "invoices": parsed.invoice_count,
            "line_items": parsed.line_item_count,
            "date_from": parsed.date_from.isoformat() if parsed.date_from else None,
            "date_to": parsed.date_to.isoformat() if parsed.date_to else None,
            "reported_range": parsed.reported_range,
            "raw_names": len(parsed.raw_names),
            "unmapped_names": unmapped,
            "continuation_rows": parsed.continuation_rows,
            "discarded_rows": parsed.discarded_rows,
            "suggestions": suggest_name_groups(parsed.raw_names),
        }
    )


@app.post("/api/clean")
def clean():
    file = request.files["file"]
    seed = request.form.get("seed") == "true"
    parsed = parse_invoice_listing(BytesIO(file.read()))
    mappings = MappingLibrary.load(MAPPING_PATH)
    if seed:
        mappings.merge_suggestions(suggest_name_groups(parsed.raw_names))
        mappings.save(MAPPING_PATH)
    frame = clean_dataframe(parsed, mappings)
    _store(frame)
    return jsonify(
        {"rows": len(frame), "stats": reports.summary_stats(frame)}
    )


@app.get("/api/mappings")
def get_mappings():
    m = MappingLibrary.load(MAPPING_PATH)
    return jsonify({"name_to_group": m.name_to_group, "code_rules": [r.__dict__ for r in m.code_rules]})


@app.post("/api/mappings")
def put_mappings():
    body = request.get_json(force=True)
    m = MappingLibrary.load(MAPPING_PATH)
    for entry in body.get("names", []):
        m.set_name(entry["raw"], entry["group"]) if entry.get("group") else m.delete_name(entry["raw"])
    for entry in body.get("codes", []):
        if entry.get("group"):
            m.set_code(entry["pattern"], entry["group"], entry.get("exact", False))
        else:
            m.delete_code(entry["pattern"])
    m.save(MAPPING_PATH)
    return jsonify({"ok": True, "names": len(m.name_to_group), "codes": len(m.code_rules)})


@app.get("/api/table")
def table():
    frame = _clean_frame()
    outlet, month = request.args.get("outlet"), request.args.get("month")
    if outlet:
        frame = frame[frame["Outlet"] == outlet]
    if month:
        frame = frame[frame["Month"] == month]
    limit = int(request.args.get("limit", 500))
    return jsonify(
        {
            "total": len(frame),
            "outlets": sorted(_clean_frame()["Outlet"].dropna().unique().tolist()) if not _clean_frame().empty else [],
            "months": sorted(_clean_frame()["Month"].dropna().unique().tolist()) if not _clean_frame().empty else [],
            "rows": frame.head(limit).astype(object).where(pd.notna(frame.head(limit)), None).to_dict("records"),
        }
    )


@app.get("/api/reports")
def api_reports():
    frame = _clean_frame()
    outlets = reports.sales_by_outlet(frame)
    return jsonify(
        {
            "stats": reports.summary_stats(frame),
            "by_outlet": outlets.to_dict("records"),
            "contribution": reports.product_contribution(frame).to_dict("records"),
            "others": reports.others_breakdown(frame).to_dict("records"),
            "monthly": reports.monthly_sales(frame).to_dict("records"),
            "best_product_per_outlet": reports.best_product_per_outlet(frame).to_dict("records"),
        }
    )


@app.get("/api/reports/outlet/<path:outlet>")
def api_outlet(outlet: str):
    frame = _clean_frame()
    products = reports.product_sales_per_outlet(frame, outlet)
    pages = reports.paginate(products)
    return jsonify(
        {
            "outlet": outlet,
            "total": float(products["Amount"].sum()) if not products.empty else 0.0,
            "pages": [p.to_dict("records") for p in pages],
        }
    )


@app.get("/api/export/<fmt>")
def export(fmt: str):
    frame = _clean_frame()
    outlet, month = request.args.get("outlet"), request.args.get("month")
    if outlet:
        frame = frame[frame["Outlet"] == outlet]
    if month:
        frame = frame[frame["Month"] == month]
    if fmt == "csv":
        return send_file(BytesIO(to_csv_bytes(frame)), mimetype="text/csv",
                         as_attachment=True, download_name="clean_data.csv")
    return send_file(
        BytesIO(to_xlsx_bytes(frame)),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="clean_data.xlsx",
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
