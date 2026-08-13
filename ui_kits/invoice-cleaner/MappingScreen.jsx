const { Icon, Button, SearchPill } = window.SubtleGradientDesignSystem_21f929;

/**
 * Two lists decide every row:
 *  - Branch names: one row per invoice code in the data. Assign the branch label
 *    for a code (300-H.LGT -> Langat) and see / set which store it belongs to.
 *    A code with no store is dropped, shown here in red so it is one edit away.
 *  - Store names: broad keyword (name or code) -> store. "ST" -> SRI TERNAK
 *    groups every ST ROSYAM branch; a store no name matches never appears.
 */
function MappingScreen({ onSaved }) {
  const d = window.INVOICE;
  const live = window.API.live;

  const [tab, setTab] = React.useState("branch");
  const [query, setQuery] = React.useState("");
  const [codes, setCodes] = React.useState(() => (d.codes || []).map((c) => ({ ...c })));
  const [stores, setStores] = React.useState(() => (d.stores || []).map((m) => ({ ...m })));
  // Original branch/store per code, so only edited codes are saved.
  const original = React.useRef(Object.fromEntries((d.codes || []).map((c) => [c.code, { branch: c.branch, store: c.store }])));
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(null);

  const touch = () => { setDirty(true); setSaved(null); };

  // --- Branch names (per invoice code) ---------------------------------
  const editCode = (code, field, value) => { setCodes(codes.map((c) => (c.code === code ? { ...c, [field]: value } : c))); touch(); };

  // --- Store names ------------------------------------------------------
  const editStore = (i, field, value) => { setStores(stores.map((s, j) => (j === i ? { ...s, [field]: value } : s))); touch(); };
  const addStore = () => { setStores([{ keyword: "", store: "" }, ...stores]); touch(); };
  const removeStore = (i) => { setStores(stores.filter((_, j) => j !== i)); touch(); };

  async function save() {
    if (!live) return window.alert("Not connected to the API — start app/server.py to persist.");
    setSaving(true);
    try {
      // Send only the fields the user actually changed, per code. A branch that
      // now equals the code fallback is sent as "" to delete its rule.
      const editedCodes = [];
      codes.forEach((c) => {
        const o = original.current[c.code] || { branch: "", store: "" };
        const entry = { code: c.code };
        if (c.branch.trim() !== o.branch.trim()) entry.branch = c.branch.trim() === c.code ? "" : c.branch.trim();
        if (c.store.trim() !== o.store.trim()) entry.store = c.store.trim();
        if (entry.branch !== undefined || entry.store !== undefined) editedCodes.push(entry);
      });
      const res = await window.API.saveMappings({
        stores: stores.filter((s) => s.keyword.trim()).map((s) => ({ keyword: s.keyword.trim(), store: s.store.trim() })),
        codes: editedCodes,
      });
      const applied = await window.API.remap();
      await window.API.boot();
      setSaved(`${res.branches} branch names, ${res.stores} store names saved · RM ${Math.round(applied.stats.totalSales).toLocaleString()} in scope`);
      setDirty(false);
      onSaved && onSaved();
    } catch (err) {
      setSaved(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const has = (v) => !query || String(v).toLowerCase().includes(query.toLowerCase());
  const shownCodes = codes.filter((c) => has(c.code) || has(c.raw) || has(c.branch) || has(c.store));
  const shownStores = stores.filter((s) => has(s.keyword) || has(s.store));
  const droppedCount = codes.filter((c) => !c.store.trim()).length;

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 14px", borderBottom: "1px solid var(--ink)", whiteSpace: "nowrap" };
  const td = { padding: "9px 14px", fontSize: 13, borderBottom: "1px solid var(--hairline-soft)", verticalAlign: "middle" };
  const input = { width: "100%", border: "1px solid var(--hairline)", background: "var(--canvas)", padding: "6px 9px", font: "inherit", fontSize: 13, fontWeight: 600, color: "var(--ink)" };
  const mono = { ...input, fontFamily: "ui-monospace, monospace", fontWeight: 500 };

  return (
    <div>
      <PageHead kicker="Step 2 · reusable across uploads" title="Mapping Manager"
        actions={<>
          {tab === "store" && <GhostButton icon="plus" onClick={addStore}>Add row</GhostButton>}
          <Button size="sm" onClick={save} disabled={saving || !dirty}>{saving ? "Saving…" : "Save"}</Button>
        </>} />

      {saved && (
        <div style={{ marginBottom: 8, padding: "12px 20px", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", fontSize: 13, color: "var(--charcoal)" }}>{saved}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 8 }}>
        <Panel pad={0} title={null} actions={null}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)" }}>
            {[
              ["branch", "Branch names", codes.length, droppedCount],
              ["store", "Store names", stores.length, 0],
            ].map(([id, label, n, alert]) => (
              <button key={id} onClick={() => { setTab(id); setQuery(""); }} style={{ flex: 1, padding: "14px 20px", background: tab === id ? "var(--canvas)" : "var(--soft-cloud)", border: "none", borderBottom: tab === id ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 600, color: tab === id ? "var(--ink)" : "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {label}
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--mute)" }}>({n})</span>
                {alert > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--canvas)", background: "var(--sale)", padding: "1px 8px", borderRadius: "var(--radius-pill)" }}>{alert} dropped</span>}
              </button>
            ))}
          </div>

          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--hairline-soft)", display: "flex", gap: 12, alignItems: "center" }}>
            <SearchPill placeholder="Search" width={260} value={query} onChange={(e) => setQuery(e.target.value)} />
            <span style={{ fontSize: 13, color: "var(--mute)", marginLeft: "auto" }}>
              {tab === "branch"
                ? "Every invoice code in the data. Set its branch, and the store it belongs to."
                : "Broad keyword → store. Matches the invoice name or code."}
            </span>
          </div>

          {tab === "branch" && (
            <div style={{ overflowX: "auto" }}>
              <table className="grid" style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
                <thead><tr>
                  <th style={{ ...th, width: 110 }}>Invoice code</th>
                  <th style={th}>Name in data</th>
                  <th style={{ ...th, width: 150 }}>Branch</th>
                  <th style={{ ...th, width: 150 }}>Store</th>
                  <th style={{ ...th, width: 96, textAlign: "right" }}>Value</th>
                </tr></thead>
                <tbody>
                  {shownCodes.map((c) => {
                    const dropped = !c.store.trim();
                    return (
                      <tr key={c.code} style={{ background: dropped ? "#fff4f4" : undefined }}>
                        <td style={{ ...td, fontFamily: "ui-monospace, monospace", color: "var(--charcoal)" }}>{c.code || "—"}</td>
                        <td style={{ ...td, color: "var(--mute)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.raw}>{c.raw || "—"}</td>
                        <td style={td}><input style={mono} value={c.branch} placeholder={c.code} disabled={!live} onChange={(e) => editCode(c.code, "branch", e.target.value)} /></td>
                        <td style={td}><input style={{ ...input, color: dropped ? "var(--sale)" : "var(--ink)" }} value={c.store} placeholder="— dropped —" disabled={!live} onChange={(e) => editCode(c.code, "store", e.target.value)} /></td>
                        <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--mute)" }}>{window.RM(c.amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!shownCodes.length && <Empty q={query} zero="No invoice codes yet — upload a file first." />}
            </div>
          )}

          {tab === "store" && (
            <table className="grid" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Keyword (name or code)</th><th style={th}>Store name</th><th style={{ ...th, width: 56 }} /></tr></thead>
              <tbody>
                {shownStores.map((s) => {
                  const i = stores.indexOf(s);
                  return (
                    <tr key={i}>
                      <td style={td}><input style={mono} value={s.keyword} placeholder="e.g. ST, SOON CHEONG, 300-C" disabled={!live} onChange={(e) => editStore(i, "keyword", e.target.value)} /></td>
                      <td style={td}><input style={input} value={s.store} placeholder="e.g. SRI TERNAK" disabled={!live} onChange={(e) => editStore(i, "store", e.target.value)} /></td>
                      <td style={td}>{live && <button onClick={() => removeStore(i)} title="Remove" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--mute)" }}><Icon name="trash-2" size={15} /></button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {tab === "store" && !shownStores.length && <Empty q={query} zero="No store names yet." />}
        </Panel>

        <Panel title="How grouping works" pad={0}>
          <Guide icon="tag" head="Branch names — one per invoice code">
            Every code in the data is listed. Set its <strong>Branch</strong> (<code style={mc}>300-H.LGT</code> → Langat) and the <strong>Store</strong> it belongs to. When the export doesn't name the outlet, the branch stays the invoice code until you rename it.
          </Guide>
          <Guide icon="git-fork" head="Store names — the groups">
            A keyword matching the name or code sets the store. <code style={mc}>ST</code> → SRI TERNAK groups every ST ROSYAM branch. To include an IKA chain (AEON, LOTUS), add it here.
          </Guide>
          <Guide icon="alert-triangle" head="No store = dropped" last>
            A code that matches no store shows red and is left out of every total — a store from your list only appears when the data actually contains it.
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
