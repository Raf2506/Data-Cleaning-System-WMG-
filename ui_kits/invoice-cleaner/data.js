// Sample cleaned dataset — the offline fallback when the Flask API is not
// reachable, and what the screens render before api.js hydrates them.
//
// These are the SCREEN shapes (camelCase), not the API's. The API returns pandas
// column names; api.js translates between the two. Keep any key added here in
// sync with the corresponding mapper in api.js.
window.INVOICE = {
  file: { name: "IKA_IV_LISTING_JAN-JULY.xlsx", uploaded: "11 Aug 2026, 09:14", size: "4.2 MB", rows: 19812 },
  parse: { invoices: 1681, lineItems: 8934, dateFrom: "2026-01-01", dateTo: "2026-07-31", rawNames: 214, continuationRows: 138, discardedRows: 10740 },
  stats: { totalSales: 4812640.55, period: "Jan 2026 – Jul 2026", outlets: 27, products: 168, unmappedRows: 412 },
  byOutlet: [
    { outlet: "ECONSAVE", amount: 1284310.4 },
    { outlet: "BORONG DIN AS CASH & CARRY", amount: 862140.15 },
    { outlet: "MYDIN", amount: 611280.0 },
    { outlet: "LOTUS'S", amount: 498220.7 },
    { outlet: "99 SPEEDMART", amount: 402115.25 },
    { outlet: "BILLION", amount: 336900.5 },
    { outlet: "TF VALUE MART", amount: 288740.0 },
    { outlet: "SEGI FRESH", amount: 214880.35 },
    { outlet: "NSK TRADE CITY", amount: 172640.9 },
    { outlet: "PASARAYA HERO", amount: 140412.3 },
  ],
  monthly: [
    { month: "2026-01", amount: 612340.2 },
    { month: "2026-02", amount: 588120.75 },
    { month: "2026-03", amount: 704880.4 },
    { month: "2026-04", amount: 668240.1 },
    { month: "2026-05", amount: 742110.6 },
    { month: "2026-06", amount: 781240.9 },
    { month: "2026-07", amount: 715707.6 },
  ],
  contribution: [
    { product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12", amount: 684220.4 },
    { product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12", amount: 521340.8 },
    { product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12", amount: 448120.0 },
    { product: "RASTO CHILLI SAUCE 340G X 24", amount: 362410.5 },
    { product: "RASTO TOMATO KETCHUP 500G X 12", amount: 298640.25 },
    { product: "RASTO OYSTER SAUCE 510G X 12", amount: 241880.9 },
    { product: "Others", amount: 2256027.7 },
  ],
  others: [
    { product: "RASTO SOY SAUCE 640ML X 12", amount: 188420.3 },
    { product: "RASTO CHILLI GARLIC 340G X 24", amount: 164280.1 },
    { product: "RASTO BLACK PEPPER SAUCE 300G X 12", amount: 142110.45 },
    { product: "RASTO MAYONNAISE 470G X 12", amount: 128940.0 },
    { product: "Remaining products", amount: 1632276.85 },
  ],
  productsByOutlet: {
    ECONSAVE: [
      { product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12", amount: 284120.5 },
      { product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12", amount: 221480.0 },
      { product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12", amount: 188640.75 },
      { product: "RASTO CHILLI SAUCE 340G X 24", amount: 142310.2 },
      { product: "RASTO TOMATO KETCHUP 500G X 12", amount: 118420.9 },
      { product: "RASTO OYSTER SAUCE 510G X 12", amount: 96840.15 },
      { product: "RASTO SOY SAUCE 640ML X 12", amount: 74210.4 },
      { product: "RASTO MAYONNAISE 470G X 12", amount: 58286.5 },
    ],
    MYDIN: [
      { product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12", amount: 168420.0 },
      { product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12", amount: 142880.5 },
      { product: "RASTO CHILLI SAUCE 340G X 24", amount: 118240.75 },
      { product: "RASTO TOMATO KETCHUP 500G X 12", amount: 96440.25 },
      { product: "RASTO OYSTER SAUCE 510G X 12", amount: 85298.5 },
    ],
  },
  bestOutletByMonth: [
    { month: "2026-01", outlet: "ECONSAVE", amount: 182400.5 },
    { month: "2026-02", outlet: "ECONSAVE", amount: 174220.0 },
    { month: "2026-03", outlet: "BORONG DIN AS CASH & CARRY", amount: 168840.75 },
    { month: "2026-04", outlet: "ECONSAVE", amount: 191240.3 },
    { month: "2026-05", outlet: "MYDIN", amount: 158920.4 },
    { month: "2026-06", outlet: "ECONSAVE", amount: 204110.9 },
    { month: "2026-07", outlet: "ECONSAVE", amount: 186880.25 },
  ],
  // Store Names — the OutletGroup universe (keyword -> store). A row matching
  // none of these is dropped.
  stores: [
    { keyword: "ECONSAVE", store: "ECONSAVE" },
    { keyword: "SRI TERNAK", store: "SRI TERNAK" },
    { keyword: "ST", store: "SRI TERNAK" },
    { keyword: "SOON CHEONG", store: "SOON CHEONG" },
    { keyword: "300-10", store: "ECONSAVE" },
  ],
  // Branch Outlet — keyword/code -> branch label.
  branchRules: [
    { keyword: "300-10042", branch: "AMPANG BARU", match: "Exact" },
    { keyword: "SNWG", branch: "SENAWANG", match: "Fragment" },
    { keyword: "C0084", branch: "BDR TECH", match: "Fragment" },
  ],
  unresolved: [
    { raw: "PASARAYA ECON JAYA (MACHANG) SDN BHD", code: "300-P0221", amount: 10533.0 },
  ],
  rows: [
    { outlet: "ECONSAVE", invoice: "IV-13371", date: "05/01/2026", month: "2026-01", product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12", qty: 10, uom: "CTN", unit: 90.0, amount: 900.0, raw: "ECONSAVE - AMPANG BARU", status: "mapped-name" },
    { outlet: "ECONSAVE", invoice: "IV-13371", date: "05/01/2026", month: "2026-01", product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12", qty: 10, uom: "CTN", unit: 60.0, amount: 600.0, raw: "ECONSAVE - AMPANG BARU", status: "mapped-name" },
    { outlet: "ECONSAVE", invoice: "IV-13372", date: "07/01/2026", month: "2026-01", product: "RASTO TOMATO BASIL PASTA SAUCE 350G X 12", qty: 5, uom: "CTN", unit: 80.0, amount: 400.0, raw: "10068 AMPANG BARU", status: "mapped-code" },
    { outlet: "BORONG DIN AS CASH & CARRY", invoice: "IV-13380", date: "12/01/2026", month: "2026-01", product: "RASTO BOLOGNESE PASTA SAUCE 350G X 12", qty: 24, uom: "CTN", unit: 88.5, amount: 2124.0, raw: "BORONG DIN AS CASH & CARRY (BAGAN SERAI)", status: "mapped-name" },
    { outlet: "MYDIN", invoice: "IV-13402", date: "19/02/2026", month: "2026-02", product: "RASTO CHILLI SAUCE 340G X 24", qty: 18, uom: "CTNe", unit: 112.0, amount: 2016.0, raw: "MYDIN MOHAMED HOLDINGS - USJ", status: "mapped-name" },
    { outlet: "SENAWANG", invoice: "IV-13455", date: "03/03/2026", month: "2026-03", product: "RASTO TOMATO KETCHUP 500G X 12", qty: 12, uom: "CTN", unit: 64.0, amount: 768.0, raw: "", status: "mapped-code" },
    { outlet: "SEGI FRESH DIST SDN BHD", invoice: "IV-13501", date: "22/03/2026", month: "2026-03", product: "RASTO OYSTER SAUCE 510G X 12", qty: 8, uom: "CTN", unit: 74.5, amount: 596.0, raw: "SEGI FRESH DIST SDN BHD", status: "unmapped" },
    { outlet: "LOTUS'S", invoice: "IV-13540", date: "08/04/2026", month: "2026-04", product: "RASTO MAYONNAISE 470G X 12", qty: 15, uom: "CTN", unit: 58.0, amount: 870.0, raw: "LOTUSS STORES (M) SDN BHD - IPOH", status: "mapped-name" },
    { outlet: "99 SPEEDMART", invoice: "IV-13588", date: "17/05/2026", month: "2026-05", product: "RASTO SOY SAUCE 640ML X 12", qty: 30, uom: "CTN", unit: 42.0, amount: 1260.0, raw: "99 SPEED MART S/B - PJ", status: "mapped-name" },
    { outlet: "10106 BATU GAJAH", invoice: "IV-13610", date: "02/06/2026", month: "2026-06", product: "RASTO BLACK PEPPER SAUCE 300G X 12", qty: 6, uom: "CTN", unit: 96.0, amount: 576.0, raw: "10106 BATU GAJAH", status: "unmapped" },
    { outlet: "BILLION", invoice: "IV-13655", date: "21/06/2026", month: "2026-06", product: "RASTO CHILLI GARLIC 340G X 24", qty: 20, uom: "CTNe", unit: 104.0, amount: 2080.0, raw: "BILLION SHOPPING CENTRE - KLANG", status: "mapped-name" },
    { outlet: "ECONSAVE", invoice: "IV-13702", date: "14/07/2026", month: "2026-07", product: "RASTO CARBONARA MUSHROOM PASTA SAUCE 350G X 12", qty: 40, uom: "CTN", unit: 90.0, amount: 3600.0, raw: "ECONSAVE - BATU GAJAH", status: "mapped-name" },
  ],
};

window.RM = (n) =>
  "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
window.RMk = (n) =>
  n >= 1000000 ? "RM " + (n / 1000000).toFixed(2) + "M" : "RM " + Math.round(n / 1000) + "k";
