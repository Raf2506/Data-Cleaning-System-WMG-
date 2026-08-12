const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

/**
 * Decomposition tree. Each column ranks the children of whatever is selected in
 * the column to its left, so a path reads left to right: outlet, then brand
 * within that outlet, then product within that brand.
 */
function TreeScreen() {
  const live = window.API.live;
  const [path, setPath] = React.useState([]);
  const [lkaOnly, setLkaOnly] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!live) return;
    setLoading(true);
    window.API.tree(path, { lkaOnly })
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setData(null))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [path.join("|"), lkaOnly, live]);

  const setScope = (v) => { setLkaOnly(v); setPath([]); };

  // Clicking a node replaces the selection from that level down.
  const choose = (depth, name) => {
    const next = path.slice(0, depth);
    if (path[depth] !== name) next.push(name);
    setPath(next);
  };

  if (!live) {
    return (
      <div>
        <PageHead kicker="Explore" title="Decomposition" />
        <Panel title="Needs the API">
          <div style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.6 }}>
            The tree aggregates the cleaned table on the server. Start
            <code style={{ margin: "0 6px", fontFamily: "ui-monospace, monospace" }}>python app/server.py</code>
            and open localhost:5000.
          </div>
        </Panel>
      </div>
    );
  }

  const levels = data ? data.levels : [];

  return (
    <div>
      <PageHead kicker="Explore" title="Decomposition"
        actions={<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: "1px solid var(--hairline)" }}>
            {[[true, "LKA outlets"], [false, "All customers"]].map(([v, label]) => (
              <button key={label} onClick={() => setScope(v)}
                style={{ padding: "8px 14px", border: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, background: lkaOnly === v ? "var(--ink)" : "var(--canvas)", color: lkaOnly === v ? "var(--canvas)" : "var(--ink)" }}>
                {label}
              </button>
            ))}
          </div>
          {path.length > 0 && <Button size="sm" variant="secondary" onClick={() => setPath([])}>Reset</Button>}
        </div>} />

      {lkaOnly && (
        <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 16, lineHeight: 1.6 }}>
          Showing only outlets listed in the outlet file, grouped by chain. Rows where the chain is
          known but the branch isn’t keep the invoice code as their branch.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "stretch", overflowX: "auto", paddingBottom: 8 }}>
        {/* The root total, mirroring the single node a decomposition tree starts from. */}
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: "var(--ink)", color: "var(--canvas)", padding: "20px 22px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--stone)" }}>
              Total sales
            </div>
            <div style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 30, lineHeight: 1.05, marginTop: 8 }}>
              {window.RM(data ? data.total : 0)}
            </div>
          </div>
          {path.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--mute)", marginTop: 12, lineHeight: 1.6 }}>
              {path.join(" › ")}
            </div>
          )}
        </div>

        {levels.map((level, depth) => {
          const max = Math.max(...level.items.map((i) => i.amount), 1);
          return (
            <div key={level.dimension + depth} style={{ flex: "0 0 300px", border: "1px solid var(--hairline)", background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--ink)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>
                  {level.dimension}
                </span>
                {level.selected && (
                  <button onClick={() => choose(depth, level.selected)} title="Clear this level"
                    style={{ border: "none", background: "none", cursor: "pointer", color: "var(--mute)", display: "flex", padding: 0 }}>
                    <Icon name="x" size={14} />
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 560, overflowY: "auto" }}>
                {level.items.map((item) => {
                  const on = level.selected === item.name;
                  const color = window.colorFor(item.name);
                  return (
                    <button key={item.name} className="node" onClick={() => choose(depth, item.name)}
                      style={{ display: "block", width: "100%", textAlign: "left", border: "none", borderLeft: `3px solid ${on ? color : "transparent"}`, borderBottom: "1px solid var(--hairline-soft)", background: on ? "var(--soft-cloud)" : "var(--canvas)", cursor: "pointer", padding: "10px 16px 10px 13px", fontFamily: "Archivo, sans-serif" }}>
                      <div style={{ height: 6, background: "var(--soft-cloud)", marginBottom: 8, borderRadius: 3, overflow: "hidden" }}>
                        <div className="barfill" style={{ height: "100%", width: (item.amount / max) * 100 + "%", background: color }} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: on ? 700 : 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.name}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--mute)", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
                        {window.RM(item.amount)}
                      </div>
                    </button>
                  );
                })}
                {!level.items.length && (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--mute)", fontSize: 13 }}>Nothing here.</div>
                )}
              </div>
            </div>
          );
        })}

        {loading && !levels.length && (
          <div style={{ padding: 24, color: "var(--mute)", fontSize: 14 }}>Loading…</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TreeScreen });
