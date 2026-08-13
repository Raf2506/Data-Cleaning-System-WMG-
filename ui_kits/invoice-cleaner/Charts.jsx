// Shared chart primitives. Horizontal bars with the exact RM value labeled at
// the end of each bar, now colour-coded so rows are easy to tell apart.

// A categorical palette anchored on the design system's teal. Colours are
// assigned by a stable hash of the label, so a given store keeps its colour
// across every chart and table.
const PALETTE = [
  "#0a7281", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#0891b2", "#ca8a04", "#dc2626", "#4f46e5", "#0d9488", "#9333ea",
  "#c026d3", "#65a30d", "#0369a1", "#b45309",
];

function colorFor(key) {
  const s = String(key == null ? "" : key);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function BarList({ rows, labelKey = "outlet", valueKey = "amount", max, format = window.RM, height = 34, colorKey, onRowClick }) {
  const top = max || Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {rows.map((r, i) => {
        // Ranked lists colour by position so neighbours always differ; pass a
        // colorKey to lock a colour to an identity instead.
        const color = colorKey ? colorFor(r[colorKey]) : PALETTE[i % PALETTE.length];
        return (
          <div key={r[labelKey]} className="barrow" onClick={onRowClick ? () => onRowClick(r) : undefined}
            style={{ display: "grid", gridTemplateColumns: "minmax(140px, 260px) 1fr auto", gap: 16, alignItems: "center", padding: "3px 6px", borderRadius: 4, cursor: onRowClick ? "pointer" : "default" }}>
            <div style={{ fontSize: 13, color: "var(--charcoal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }} title={r[labelKey]}>
              <span style={{ width: 9, height: 9, flex: "0 0 auto", borderRadius: 2, background: color }} />
              {r[labelKey]}
            </div>
            <div style={{ background: "var(--soft-cloud)", height, borderRadius: 3, overflow: "hidden" }}>
              <div className="barfill" style={{ width: (r[valueKey] / top) * 100 + "%", height: "100%", background: color }} title={format(r[valueKey])} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 110, textAlign: "right" }}>{format(r[valueKey])}</div>
          </div>
        );
      })}
    </div>
  );
}

function ColumnChart({ rows, labelKey = "month", valueKey = "amount", height = 180 }) {
  const top = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height }}>
      {rows.map((r) => (
        <div key={r[labelKey]} className="colbar" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, height: "100%" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textAlign: "center", color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{window.RMk(r[valueKey])}</div>
          <div className="colfill" style={{ height: (r[valueKey] / top) * 100 + "%", background: colorFor(r[labelKey]), borderRadius: "3px 3px 0 0" }} title={window.RM(r[valueKey])} />
          <div style={{ fontSize: 11, textAlign: "center", color: "var(--mute)" }}>{window.monthLabel(r[labelKey])}</div>
        </div>
      ))}
    </div>
  );
}

// Donut slices cycle the full palette for maximum contrast between neighbours.
const DONUT_TONES = PALETTE;

function Donut({ rows, labelKey = "product", valueKey = "amount", size = 240, thickness = 42 }) {
  const total = rows.reduce((a, r) => a + r[valueKey], 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "0 0 auto" }}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {rows.map((row, i) => {
            const len = (row[valueKey] / total) * c;
            const el = (
              <circle key={row[labelKey]} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={DONUT_TONES[i % DONUT_TONES.length]} strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}>
                <title>{`${row[labelKey]} — ${window.RM(row[valueKey])}`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column" }}>
        {rows.map((row, i) => (
          <div key={row[labelKey]} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--hairline-soft)" }}>
            <span style={{ width: 12, height: 12, flex: "0 0 auto", background: DONUT_TONES[i % DONUT_TONES.length] }} />
            <span style={{ fontSize: 13, color: "var(--charcoal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row[labelKey]}>{row[labelKey]}</span>
            <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{window.RM(row[valueKey])}</span>
            <span style={{ fontSize: 13, fontWeight: 600, width: 56, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{((row[valueKey] / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BarList, ColumnChart, Donut, DONUT_TONES, PALETTE, colorFor });
