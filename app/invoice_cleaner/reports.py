"""Aggregations behind the three report sections and the summary stat cards."""
from __future__ import annotations

import pandas as pd

from .workbook import UOM_BUCKETS, breakdown_by_uom, with_uom_columns

BARS_PER_PAGE = 24  # Spec section 3: paginate rather than shrink bars to illegibility.


def _total(frame: pd.DataFrame) -> float:
    return float(frame["Amount"].fillna(0).sum()) if not frame.empty else 0.0


def _ranked(frame: pd.DataFrame, dimension: str) -> pd.DataFrame:
    grouped = (
        frame.groupby(dimension, dropna=False)["Amount"].sum().sort_values(ascending=False).reset_index()
    )
    total = grouped["Amount"].sum() or 1
    grouped["Share"] = grouped["Amount"] / total
    return grouped


def sales_by_outlet(frame: pd.DataFrame) -> pd.DataFrame:
    """Outlets (branches) descending by total sales."""
    if frame.empty:
        return pd.DataFrame(columns=["Outlet", "Amount", "Share"])
    return _ranked(frame, "Outlet")


def sales_by_store(frame: pd.DataFrame) -> pd.DataFrame:
    """Stores (OutletGroups) descending by total sales — the dashboard headline."""
    if frame.empty:
        return pd.DataFrame(columns=["OutletGroup", "Amount", "Share"])
    return _ranked(frame, "OutletGroup")


def product_sales_per_outlet(frame: pd.DataFrame, outlet: str) -> pd.DataFrame:
    """Report section 2 — one outlet's products, descending by sales value."""
    subset = frame[frame["Outlet"] == outlet]
    if subset.empty:
        return pd.DataFrame(columns=["Product", "Amount", "Quantity"])
    return (
        subset.groupby("Product", dropna=False)
        .agg(Amount=("Amount", "sum"), Quantity=("Quantity", "sum"))
        .sort_values("Amount", ascending=False)
        .reset_index()
    )


def paginate(frame: pd.DataFrame, per_page: int = BARS_PER_PAGE) -> list[pd.DataFrame]:
    if frame.empty:
        return [frame]
    return [frame.iloc[i : i + per_page] for i in range(0, len(frame), per_page)]


def product_contribution(frame: pd.DataFrame, top_n: int | None = None) -> pd.DataFrame:
    """Report section 3 — every product ranked by sales, with its share.

    top_n is kept for callers that still want a capped list; by default every
    product is returned so the UI can show them all in one donut and collapse
    the long tail behind a "show more" toggle.
    """
    if frame.empty:
        return pd.DataFrame(columns=["Product", "Amount", "Share"])
    grouped = frame.groupby("Product", dropna=False)["Amount"].sum().sort_values(ascending=False)
    ranked = (grouped.head(top_n) if top_n else grouped).reset_index()
    total = ranked["Amount"].sum() or 1
    ranked["Share"] = ranked["Amount"] / total
    return ranked


def others_breakdown(frame: pd.DataFrame, top_n: int = 25, detail_n: int = 20) -> pd.DataFrame:
    """The companion donut: what sits inside 'Others', as a share of company-wide sales."""
    if frame.empty:
        return pd.DataFrame(columns=["Product", "Amount", "Share of Total"])
    grouped = frame.groupby("Product", dropna=False)["Amount"].sum().sort_values(ascending=False)
    rest = grouped.iloc[top_n:]
    if rest.empty:
        return pd.DataFrame(columns=["Product", "Amount", "Share of Total"])
    detail = rest.head(detail_n).reset_index()
    tail = float(rest.iloc[detail_n:].sum())
    if tail > 0:
        detail = pd.concat(
            [detail, pd.DataFrame([{"Product": "Remaining products", "Amount": tail}])], ignore_index=True
        )
    company_total = _total(frame) or 1
    detail["Share of Total"] = detail["Amount"] / company_total
    return detail


def monthly_sales(frame: pd.DataFrame) -> pd.DataFrame:
    if frame.empty:
        return pd.DataFrame(columns=["Month", "Amount"])
    return frame.groupby("Month", dropna=False)["Amount"].sum().sort_index().reset_index()


def uom_mix(frame: pd.DataFrame) -> list[dict]:
    """How much was sold in each unit of measure — cartons, units, pieces.

    Quantities in different units cannot be added together, so they are reported
    as separate lines rather than one meaningless grand total.
    """
    if frame.empty:
        return []
    data = with_uom_columns(frame)
    amount = pd.to_numeric(data["Amount"], errors="coerce").fillna(0.0)
    out = []
    for bucket in UOM_BUCKETS:
        rows = data[data[bucket] > 0]
        if rows.empty:
            continue
        out.append(
            {
                "bucket": bucket,
                "quantity": float(data[bucket].sum()),
                "amount": float(amount[data[bucket] > 0].sum()),
                "lines": int(len(rows)),
                # The raw codes folded into this bucket, e.g. OTHER = BTL, ROLL.
                "codes": sorted({str(u).strip().upper() for u in rows["UOM"] if str(u).strip()}),
            }
        )
    return sorted(out, key=lambda r: -r["quantity"])


def brand_ranking(frame: pd.DataFrame) -> list[dict]:
    """Every brand, best to worst, with its unit-of-measure split."""
    if frame.empty:
        return []
    table = breakdown_by_uom(with_uom_columns(frame), "Brand").sort_values("AMOUNT", ascending=False)
    total = float(table["AMOUNT"].sum()) or 1.0
    return [
        {
            "brand": str(name),
            "amount": float(values["AMOUNT"]),
            "share": float(values["AMOUNT"]) / total,
            "quantity": float(values["QUANTITY"]),
            **{b.lower(): float(values[b]) for b in UOM_BUCKETS},
        }
        for name, values in table.iterrows()
    ]


def top_stores_per_month(frame: pd.DataFrame, top_n: int = 5) -> list[dict]:
    """The best-selling stores in each month, ranked."""
    if frame.empty:
        return []
    grouped = (
        frame.groupby(["Month", "OutletGroup"], dropna=False)["Amount"].sum().reset_index()
    )
    out = []
    for month in sorted({m for m in grouped["Month"] if m}):
        rows = grouped[grouped["Month"] == month].sort_values("Amount", ascending=False)
        month_total = float(rows["Amount"].sum()) or 1.0
        out.append(
            {
                "month": str(month),
                "total": float(rows["Amount"].sum()),
                "stores": [
                    {
                        "store": str(r["OutletGroup"]),
                        "amount": float(r["Amount"]),
                        "share": float(r["Amount"]) / month_total,
                    }
                    for _, r in rows.head(top_n).iterrows()
                ],
            }
        )
    return out


def summary_stats(frame: pd.DataFrame) -> dict:
    """The stat cards above the charts (spec section 4.5)."""
    if frame.empty:
        return {}
    outlets = sales_by_outlet(frame)
    stores = sales_by_store(frame)
    products = frame.groupby("Product", dropna=False)["Amount"].sum().sort_values(ascending=False)
    months = monthly_sales(frame)
    best_per_month = (
        frame.groupby(["Month", "Outlet"])["Amount"].sum().reset_index().sort_values("Amount", ascending=False)
    )
    best_store_per_month = (
        frame.groupby(["Month", "OutletGroup"])["Amount"].sum().reset_index().sort_values("Amount", ascending=False)
    )
    unmapped = frame[frame["Mapping Status"] == "unmapped"]
    return {
        "total_sales": _total(frame),
        "period": (str(frame["Month"].min()), str(frame["Month"].max())),
        "invoice_count": int(frame["Invoice No"].nunique()),
        "line_item_count": int(len(frame)),
        "outlet_count": int(frame["Outlet"].nunique()),
        "store_count": int(frame["OutletGroup"].nunique()),
        "product_count": int(frame["Product"].nunique()),
        "best_outlet": (outlets.iloc[0]["Outlet"], float(outlets.iloc[0]["Amount"])) if len(outlets) else None,
        "best_store": (stores.iloc[0]["OutletGroup"], float(stores.iloc[0]["Amount"])) if len(stores) else None,
        "best_product": (products.index[0], float(products.iloc[0])) if len(products) else None,
        "best_month": (months.iloc[months["Amount"].idxmax()]["Month"], float(months["Amount"].max()))
        if len(months)
        else None,
        "best_outlet_by_month": best_per_month.drop_duplicates("Month").to_dict("records"),
        "best_store_by_month": best_store_per_month.drop_duplicates("Month").to_dict("records"),
        "unmapped_rows": int(len(unmapped)),
        "unmapped_names": sorted(unmapped["Raw Name"].dropna().unique().tolist()),
    }


def best_product_per_outlet(frame: pd.DataFrame) -> pd.DataFrame:
    if frame.empty:
        return pd.DataFrame(columns=["Outlet", "Product", "Amount"])
    grouped = frame.groupby(["Outlet", "Product"])["Amount"].sum().reset_index()
    return grouped.sort_values("Amount", ascending=False).drop_duplicates("Outlet").reset_index(drop=True)
