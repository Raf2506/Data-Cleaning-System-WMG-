"""Aggregations behind the three report sections and the summary stat cards."""
from __future__ import annotations

import pandas as pd

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
        "unmapped_rows": int(len(unmapped)),
        "unmapped_names": sorted(unmapped["Raw Name"].dropna().unique().tolist()),
    }


def best_product_per_outlet(frame: pd.DataFrame) -> pd.DataFrame:
    if frame.empty:
        return pd.DataFrame(columns=["Outlet", "Product", "Amount"])
    grouped = frame.groupby(["Outlet", "Product"])["Amount"].sum().reset_index()
    return grouped.sort_values("Amount", ascending=False).drop_duplicates("Outlet").reset_index(drop=True)
