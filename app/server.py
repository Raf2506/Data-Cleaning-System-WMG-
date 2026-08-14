"""Flask API for the invoice cleaning UI. Thin: all logic lives in invoice_cleaner."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, redirect, request, send_file
from werkzeug.exceptions import HTTPException

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
ROOT = BASE.parent  # repo root — the UI kit and design system assets live here
DATA = BASE / "data"
MAPPING_PATH = DATA / "mappings.json"
CLEAN_PATH = DATA / "clean.parquet"
SEED_PATH = BASE / "mappings.seed.json"  # committed defaults for a fresh deploy
UI = "/ui_kits/invoice-cleaner/index.html"


def _ensure_mappings() -> None:
    """On a fresh host (Render, etc.) app/data is empty, so seed the keyword
    library from the committed defaults the first time the server starts."""
    if not MAPPING_PATH.exists() and SEED_PATH.exists():
        DATA.mkdir(parents=True, exist_ok=True)
        MAPPING_PATH.write_text(SEED_PATH.read_text(encoding="utf-8"), encoding="utf-8")


_ensure_mappings()

# The UI kit loads ../../styles.css and ../../_ds_bundle.js, so the repo root is
# the static root and the UI is served from its own path rather than at "/".
app = Flask(__name__, static_folder=str(ROOT), static_url_path="")


def _clean_frame() -> pd.DataFrame:
    """The full cleaned table, including rows that match no Store Name."""
    if CLEAN_PATH.exists():
        return pd.read_parquet(CLEAN_PATH)
    return pd.DataFrame()


def _scoped_frame() -> pd.DataFrame:
    """Only rows that belong to a Store Name — what every report is built on.

    Out-of-scope rows stay in the stored table for the Dropped tab and audit,
    but are excluded from all totals so "not in a store = dropped" holds.
    """
    frame = _clean_frame()
    if frame.empty or "Mapping Status" not in frame.columns:
        return frame
    return frame[frame["Mapping Status"] != "out-of-scope"]


def _store(frame: pd.DataFrame) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    frame.to_parquet(CLEAN_PATH, index=False)


@app.errorhandler(Exception)
def on_error(err):
    """Fail as JSON.

    Without this the debug server answers with its HTML traceback page, which
    the UI then renders as a wall of markup instead of a readable message.
    """
    if isinstance(err, HTTPException):
        return err
    app.logger.exception("request failed")
    return jsonify({"error": type(err).__name__, "message": str(err)}), 400


@app.get("/")
def index():
    """Redirect rather than serve, so the UI kit's relative asset paths resolve."""
    return redirect(UI)


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
        {"rows": len(frame), "stats": reports.summary_stats(_scoped_frame())}
    )


@app.get("/api/mappings")
def get_mappings():
    m = MappingLibrary.load(MAPPING_PATH)
    frame = _clean_frame()
    # One row per invoice code seen in the data — the "Branch names" table. Each
    # shows how the code currently resolves (branch + store) and its value, so a
    # code with no store is visible and one edit away from being included.
    codes = []
    if not frame.empty:
        cols = ["Code", "Raw Name", "OutletGroup", "Outlet", "Mapping Status"]
        first = frame[cols].drop_duplicates("Code")
        value = frame.groupby("Code")["Amount"].sum().to_dict()
        for r in first.astype(object).where(pd.notna(first), None).to_dict("records"):
            code = r["Code"] or ""
            codes.append(
                {
                    "code": code,
                    "raw": r["Raw Name"] or "",
                    "branch": r["Outlet"] or "",
                    "store": "" if r["Mapping Status"] == "out-of-scope" else (r["OutletGroup"] or ""),
                    "dropped": r["Mapping Status"] == "out-of-scope",
                    "amount": float(value.get(code, 0.0)),
                }
            )
        codes.sort(key=lambda c: -c["amount"])
    return jsonify(
        {
            # Store Names: keyword (name or code) -> OutletGroup.
            "stores": [{"keyword": k, "store": v} for k, v in sorted(m.chain_keywords.items())],
            # Branch names: every invoice code in the data with its resolution.
            "codes": codes,
            # The raw branch keyword rules, so the UI can tell an assigned code
            # from one still on its code fallback.
            "branch_rules": [r.__dict__ for r in m.code_rules],
        }
    )


@app.post("/api/mappings")
def put_mappings():
    body = request.get_json(force=True)
    m = MappingLibrary.load(MAPPING_PATH)

    # Store Names: broad keyword (name or code) -> store. Empty store deletes.
    for entry in body.get("stores", []):
        keyword = (entry.get("keyword") or "").strip()
        if not keyword:
            continue
        store = (entry.get("store") or "").strip()
        m.set_store(keyword, store) if store else m.delete_store(keyword)

    # Branch names: one entry per invoice code. A sent branch becomes an exact
    # code rule; a sent store an exact code-keyed override. Fields absent from
    # the entry are left untouched, so editing one never clears the other.
    for entry in body.get("codes", []):
        code = (entry.get("code") or "").strip()
        if not code:
            continue
        if "branch" in entry:
            branch = (entry.get("branch") or "").strip()
            m.set_code(code, branch, exact=True) if branch else m.delete_code(code)
        if "store" in entry:
            store = (entry.get("store") or "").strip()
            m.set_store(code, store) if store else m.delete_store(code)

    m.save(MAPPING_PATH)
    return jsonify({"ok": True, "branches": len(m.code_rules), "stores": len(m.chain_keywords)})


@app.post("/api/remap")
def remap():
    """Re-resolve outlets on the stored clean table after a mapping edit.

    The clean table keeps Code and Raw Name, so corrected mappings can be applied
    without re-uploading the source file.
    """
    frame = _clean_frame()
    if frame.empty:
        return jsonify({"rows": 0, "stats": {}})
    mappings = MappingLibrary.load(MAPPING_PATH)
    resolved = [
        mappings.group_and_branch(row.get("Raw Name", ""), row.get("Code", ""))
        for row in frame.to_dict("records")
    ]
    frame["OutletGroup"] = [group for group, _, _ in resolved]
    frame["Outlet"] = [branch for _, branch, _ in resolved]
    frame["Mapping Status"] = [status for _, _, status in resolved]
    _store(frame)
    return jsonify({"rows": len(frame), "stats": reports.summary_stats(_scoped_frame())})


@app.get("/api/table")
def table():
    full = _scoped_frame()
    frame = full
    group, outlet, month = request.args.get("group"), request.args.get("outlet"), request.args.get("month")
    if group:
        frame = frame[frame["OutletGroup"] == group]
    if outlet:
        frame = frame[frame["Outlet"] == outlet]
    if month:
        frame = frame[frame["Month"] == month]
    limit = int(request.args.get("limit", 500))
    page = frame.head(limit).copy()
    if not page.empty:
        # Timestamps would serialise as RFC-822; the table wants the source format.
        page["Date"] = pd.to_datetime(page["Date"], errors="coerce").dt.strftime("%d/%m/%Y")
    return jsonify(
        {
            "total": len(frame),
            # Stores (OutletGroups) are what the picker lists — one SRI TERNAK,
            # not each ST ROSYAM branch. Outlets are still returned for detail.
            "groups": sorted(full["OutletGroup"].dropna().unique().tolist()) if not full.empty else [],
            "outlets": sorted(full["Outlet"].dropna().unique().tolist()) if not full.empty else [],
            "months": sorted(full["Month"].dropna().unique().tolist()) if not full.empty else [],
            "rows": page.astype(object).where(pd.notna(page), None).to_dict("records"),
        }
    )


TREE_LEVELS = ["OutletGroup", "Outlet", "Brand", "Product"]


@app.get("/api/tree")
def tree():
    """Decomposition tree: ranked children at each level under a chosen path.

    `path` is the selection so far, pipe separated and aligned to TREE_LEVELS.
    Each level is filtered by everything selected above it, so the columns read
    left to right exactly as they are drawn.

    scope=lka keeps only rows belonging to a mapped chain — the outlets in the
    outlet file — dropping the large single-account chains the tool also sees.
    """
    # Out of scope is dropped, unless the caller asks to see everything.
    frame = _clean_frame() if request.args.get("include_unmatched") == "1" else _scoped_frame()
    selected = [p for p in (request.args.get("path") or "").split("|") if p]
    if frame.empty:
        return jsonify({"total": 0.0, "levels": []})

    levels = []
    scope = frame
    for depth, dimension in enumerate(TREE_LEVELS):
        grouped = (
            scope.groupby(dimension, dropna=False)["Amount"]
            .sum()
            .sort_values(ascending=False)
        )
        chosen = selected[depth] if depth < len(selected) else None
        levels.append(
            {
                "dimension": dimension,
                "selected": chosen,
                "total": float(scope["Amount"].fillna(0).sum()),
                "items": [
                    {"name": str(name), "amount": float(amount)}
                    for name, amount in grouped.items()
                ],
            }
        )
        if chosen is None:
            break
        scope = scope[scope[dimension].astype(str) == chosen]
        if scope.empty:
            break

    return jsonify({"total": float(frame["Amount"].fillna(0).sum()), "levels": levels})


@app.post("/api/reset")
def reset():
    """Forget the cleaned table so the app starts empty until the next upload."""
    if CLEAN_PATH.exists():
        CLEAN_PATH.unlink()
    return jsonify({"ok": True})


def _rank(frame: pd.DataFrame, dimension: str) -> list[dict]:
    grouped = (
        frame.groupby(dimension, dropna=False)["Amount"].sum().sort_values(ascending=False)
    )
    return [{"name": str(name), "amount": float(amount)} for name, amount in grouped.items()]


@app.get("/api/brands")
def brands():
    """Company-wide brand totals for the dashboard pie."""
    frame = _scoped_frame()
    if frame.empty:
        return jsonify({"total": 0.0, "brands": []})
    return jsonify({"total": float(frame["Amount"].fillna(0).sum()), "brands": _rank(frame, "Brand")})


@app.get("/api/breakdown")
def breakdown():
    """Drill a bar chart: an outlet's brands, or one brand's products within it.

    No params -> outlets. outlet -> that outlet's brands. outlet+brand -> the
    products of that brand at that outlet, best first.
    """
    frame = _scoped_frame()
    outlet, brand = request.args.get("outlet"), request.args.get("brand")
    if frame.empty:
        return jsonify({"level": "outlet", "items": []})
    if outlet:
        frame = frame[frame["Outlet"] == outlet]
    if brand:
        frame = frame[frame["Brand"] == brand]
    if not outlet:
        return jsonify({"level": "outlet", "items": _rank(frame, "Outlet")})
    if not brand:
        return jsonify({"level": "brand", "outlet": outlet, "items": _rank(frame, "Brand")})
    return jsonify({"level": "product", "outlet": outlet, "brand": brand, "items": _rank(frame, "Product")})


@app.get("/api/reports")
def api_reports():
    frame = _scoped_frame()
    outlets = reports.sales_by_outlet(frame)
    return jsonify(
        {
            "stats": reports.summary_stats(frame),
            "by_outlet": outlets.to_dict("records"),
            "by_store": reports.sales_by_store(frame).to_dict("records"),
            "contribution": reports.product_contribution(frame).to_dict("records"),
            "monthly": reports.monthly_sales(frame).to_dict("records"),
            "best_product_per_outlet": reports.best_product_per_outlet(frame).to_dict("records"),
        }
    )


@app.get("/api/reports/outlet/<path:outlet>")
def api_outlet(outlet: str):
    frame = _scoped_frame()
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
    frame = _scoped_frame()
    group, outlet, month = request.args.get("group"), request.args.get("outlet"), request.args.get("month")
    if group:
        frame = frame[frame["OutletGroup"] == group]
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
