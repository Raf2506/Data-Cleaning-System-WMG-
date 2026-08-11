import React from "react";

export function FilterSidebar({ groups = [], selected = [], onToggle, width = "var(--sidebar-filter)", style, ...rest }) {
  return (
    <aside style={{ width, background: "var(--canvas)", flex: "0 0 auto", ...style }} {...rest}>
      {groups.map((g) => (
        <div key={g.title} style={{ padding: "var(--space-lg) 0", borderBottom: "var(--border-hairline)" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "var(--body-md-size)", fontWeight: 500, color: "var(--ink)", marginBottom: "var(--space-md)" }}>{g.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", alignItems: "flex-start" }}>
            {g.options.map((o) => {
              const on = selected.includes(o.label);
              return (
                <button key={o.label} onClick={() => onToggle && onToggle(o.label)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "var(--caption-md-size)", fontWeight: 500, color: "var(--ink)", borderBottom: on ? "1px solid var(--ink)" : "1px solid transparent" }}>
                  {o.label} {o.count != null && <span style={{ color: "var(--mute)" }}>({o.count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
