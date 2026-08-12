const { Icon, Button, SearchPill } = window.SubtleGradientDesignSystem_21f929;

/**
 * Two lists decide every row:
 *  - Store Names  : keyword -> OutletGroup. The inclusion universe. A row that
 *                   matches no store is dropped.
 *  - Branch Outlet: keyword/code -> branch label within a store.
 * The Dropped tab lists rows currently out of scope, so revenue that needs a
 * store is visible and one click away from being included.
 */
function MappingScreen({ onSaved }) {
  const d = window.INVOICE;
  const live = window.API.live;

  const [tab, setTab] = React.useState("store");
  const [query, setQuery] = React.useState("");
  const [stores, setStores] = React.useState(() => (d.stores || []).map((m) => ({ ...m })));
  const [branches, setBranches] = React.useState(() => (d.branchRules || []).map((m) => ({ ...m })));
  const [dropped, setDropped] = React.useState(() =>
    (d.unresolved || []).map((u) => ({ ...u, store: "", keyword: window.suggestKeyword(u.raw) }))
  );
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(null);

  const touch = () => { setDirty(true); setSaved(null); };

  // --- Store Names ------------------------------------------------------
  const editStore = (i, field, value) => { setStores(stores.map((s, j) => (j === i ? { ...s, [field]: value } : s))); touch(); };
  const addStore = () => { setStores([{ keyword: "", store: "" }, ...stores]); touch(); };
  const removeStore = (i) => { setStores(stores.filter((_, j) => j !== i)); touch(); };

  // --- Branch Outlet ----------------------------------------------------
  const editBranch = (i, field, value) => { setBranches(branches.map((b, j) => (j === i ? { ...b, [field]: value } : b))); touch(); };
  const addBranch = () => { setBranches([{ keyword: "", branch: "", match: "Fragment" }, ...branches]); touch(); };
  const removeBranch = (i) => { setBranches(branches.filter((_, j) => j !== i)); touch(); };

  // --- Dropped ----------------------------------------------------------
  const editDropped = (raw, field, value) => { setDropped(dropped.map((q) => (q.raw === raw ? { ...q, [field]: value } : q))); };
  const includeOne = (row) => {
    const store = (row.store || row.keyword).trim();
    if (!store) return;
    setStores([{ keyword: (row.keyword || store).trim(), store }, ...stores]);
    setDropped(dropped.filter((q) => q.raw !== row.raw));
    touch();
  };

  async function save() {
    if (!live) return window.alert("Not connected to the API — start app/server.py to persist.");
    setSaving(true);
    try {
      const res = await window.API.saveMappings({
        stores: stores.filter((s) => s.keyword.trim()).map((s) => ({ keyword: s.keyword.trim(), store: s.store.trim() })),
        branches: branches.filter((b) => b.keyword.trim()).map((b) => ({ pattern: b.keyword.trim(), branch: b.branch.trim(), exact: b.match === "Exact" })),
      });
      const applied = await window.API.remap();
      await window.API.boot();
      setSaved(`${res.stores} store names, ${res.branches} branch rules saved · RM ${Math.round(applied.stats.totalSales).toLocaleString()} in scope`);
      setDirty(false);
      onSaved && onSaved();
    } catch (err) {
      setSaved(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const has = (v) => !query || String(v).toLowerCase().includes(query.toLowerCase());
  const shownStores = stores.filter((s) => has(s.keyword) || has(s.store));
  const shownBranches = branches.filter((b) => has(b.keyword) || has(b.branch));
  const shownDropped = dropped.filter((q) => has(q.raw) || has(q.keyword) || has(q.store));
  const droppedValue = dropped.reduce((a, q) => a + (q.amount || 0), 0);

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 16px", borderBottom: "1px solid var(--ink)" };
  const td = { padding: "10px 16px", fontSize: 14, borderBottom: "1px solid var(--hairline-soft)", verticalAlign: "middle" };
  const input = { width: "100%", border: "1px solid var(--hairline)", background: "var(--canvas)", padding: "6px 10px", font: "inherit", fontSize: 14, fontWeight: 600, color: "var(--ink)" };
  const mono = { ...input, fontFamily: "ui-monospace, monospace", fontWeight: 500 };

  const add = tab === "store" ? addStore : tab === "branch" ? addBranch : null;

  return (
    <div>
      <PageHead kicker="Step 2 · reusable across uploads" title="Mapping Manager"
        actions={<>
          {add && <GhostButton icon="plus" onClick={add}>Add row</GhostButton>}
          <Button size="sm" onClick={save} disabled={saving || !dirty}>{saving ? "Saving…" : "Save"}</Button>
        </>} />

      {saved && (
        <div style={{ marginBottom: 8, padding: "12px 20px", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", fontSize: 13, color: "var(--charcoal)" }}>{saved}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 8 }}>
        <Panel pad={0} title={null} actions={null}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)" }}>
            {[
              ["store", "Store Names", stores.length, false],
              ["branch", "Branch Outlet", branches.length, false],
              ["dropped", "Dropped", dropped.length, dropped.length > 0],
            ].map(([id, label, n, alert]) => (
              <button key={id} onClick={() => { setTab(id); setQuery(""); }} style={{ flex: 1, padding: "14px 20px", background: tab === id ? "var(--canvas)" : "var(--soft-cloud)", border: "none", borderBottom: tab === id ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 600, color: tab === id ? "var(--ink)" : "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {label}
                <span style={{ fontSize: 12, fontWeight: 600, color: alert ? "var(--canvas)" : "var(--mute)", background: alert ? "var(--sale)" : "transparent", padding: alert ? "1px 8px" : 0, borderRadius: "var(--radius-pill)" }}>{alert ? n : `(${n})`}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)", display: "flex", gap: 12, alignItems: "center" }}>
            <SearchPill placeholder="Search" width={260} value={query} onChange={(e) => setQuery(e.target.value)} />
            <span style={{ fontSize: 13, color: "var(--mute)", marginLeft: "auto" }}>
              {tab === "store"
                ? "Keyword matches the invoice name or code. A row matching none is dropped."
                : tab === "branch"
                ? "Keyword → branch label. The store comes from the Store Names on the same row."
                : `${dropped.length} raw names in no store — RM ${Math.round(droppedValue).toLocaleString()} out of scope.`}
            </span>
          </div>

          {tab === "store" && (
            <table className="grid" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Keyword (name or code)</th><th style={th}>Store name (OutletGroup)</th><th style={{ ...th, width: 60 }} /></tr></thead>
              <tbody>
                {shownStores.map((s, i) => (
                  <tr key={i}>
                    <td style={td}><input style={mono} value={s.keyword} placeholder="e.g. ST, SOON CHEONG, 300-C" disabled={!live} onChange={(e) => editStore(stores.indexOf(s), "keyword", e.target.value)} /></td>
                    <td style={td}><input style={input} value={s.store} placeholder="e.g. SRI TERNAK" disabled={!live} onChange={(e) => editStore(stores.indexOf(s), "store", e.target.value)} /></td>
                    <td style={td}>{live && <button onClick={() => removeStore(stores.indexOf(s))} title="Remove" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--mute)" }}><Icon name="trash-2" size={15} /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "branch" && (
            <table className="grid" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Keyword (code or name)</th><th style={th}>Branch outlet</th><th style={{ ...th, width: 110 }}>Match</th><th style={{ ...th, width: 60 }} /></tr></thead>
              <tbody>
                {shownBranches.map((b, i) => (
                  <tr key={i}>
                    <td style={td}><input style={mono} value={b.keyword} placeholder="e.g. C0084, SNWG" disabled={!live} onChange={(e) => editBranch(branches.indexOf(b), "keyword", e.target.value)} /></td>
                    <td style={td}><input style={input} value={b.branch} placeholder="e.g. BDR TECH" disabled={!live} onChange={(e) => editBranch(branches.indexOf(b), "branch", e.target.value)} /></td>
                    <td style={td}>
                      <select value={b.match || "Fragment"} disabled={!live} onChange={(e) => editBranch(branches.indexOf(b), "match", e.target.value)}
                        style={{ font: "inherit", fontSize: 13, padding: "5px 6px", border: "1px solid var(--hairline)", background: "var(--canvas)" }}>
                        <option>Fragment</option><option>Exact</option>
                      </select>
                    </td>
                    <td style={td}>{live && <button onClick={() => removeBranch(branches.indexOf(b))} title="Remove" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--mute)" }}><Icon name="trash-2" size={15} /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "dropped" && (
            <table className="grid" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Raw name in your data</th><th style={{ ...th, width: 96 }}>Code</th><th style={{ ...th, width: 110, textAlign: "right" }}>Value</th><th style={th}>Add as store</th><th style={{ ...th, width: 70 }} /></tr></thead>
              <tbody>
                {shownDropped.map((q) => (
                  <tr key={q.raw}>
                    <td style={{ ...td, color: "var(--charcoal)" }}>{q.raw}</td>
                    <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontSize: 13, color: "var(--mute)" }}>{q.code || "—"}</td>
                    <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--mute)" }}>{window.RM(q.amount || 0)}</td>
                    <td style={td}><input style={input} value={q.store} placeholder="store name" disabled={!live} onChange={(e) => editDropped(q.raw, "store", e.target.value)} /></td>
                    <td style={td}>{live && <GhostButton icon="check" onClick={() => includeOne(q)}>Add</GhostButton>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "store" && !shownStores.length && <Empty q={query} zero="No store names yet. Add one to bring rows into scope." />}
          {tab === "branch" && !shownBranches.length && <Empty q={query} zero="No branch rules yet." />}
          {tab === "dropped" && !shownDropped.length && <Empty q={query} zero="Nothing dropped — every row belongs to a store." />}
        </Panel>

        <Panel title="How grouping works" pad={0}>
          <Guide icon="git-fork" head="Store Names decide inclusion">
            A row is kept only if its name or code matches a Store Name. <strong>ST ROSYAM MART</strong> matches the keyword <code style={mc}>ST</code> → grouped under <strong>SRI TERNAK</strong>. To include IKA accounts (AEON, LOTUS, NSK), add them here.
          </Guide>
          <Guide icon="tag" head="Branch Outlet names the store">
            <code style={mc}>C0084</code> → <strong>BDR TECH</strong>. When the invoice carries the code but not the outlet, the branch is labelled from the code and grouped under whichever Store Name the row matches.
          </Guide>
          <Guide icon="corner-down-right" head="No branch named? Use the code">
            <strong>SOON CHEONG MARINE PRODUCT</strong> with no outlet → grouped under <strong>SOON CHEONG</strong>, branch <code style={mc}>300-S0256</code>.
          </Guide>
          <Guide icon="trash-2" head="Everything else is dropped" last>
            Rows in no Store Name sit in the <strong>Dropped</strong> tab with their value, never silently deleted. Add a store to pull them back in.
            {!live && <><br /><strong>Read-only</strong> — editing needs the API running.</>}
          </Guide>
        </Panel>
      </div>
    </div>
  );
}

const mc = { fontFamily: "ui-monospace, monospace", background: "var(--soft-cloud)", padding: "1px 4px" };

function Empty({ q, zero }) {
  return <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>{q ? `Nothing matches “${q}”.` : zero}</div>;
}

function Guide({ icon, head, children, last }) {
  return (
    <div style={{ padding: "16px 24px", borderBottom: last ? "none" : "1px solid var(--hairline-soft)", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Icon name={icon} size={17} color="var(--mute)" />
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--charcoal)" }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{head}</div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { MappingScreen });
