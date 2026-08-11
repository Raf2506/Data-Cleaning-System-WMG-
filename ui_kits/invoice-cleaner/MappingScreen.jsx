const { Icon, Button, SearchPill } = window.SubtleGradientDesignSystem_21f929;

function MappingScreen({ onSaved }) {
  const d = window.INVOICE;
  const live = window.API.live;

  const [tab, setTab] = React.useState("name");
  const [selected, setSelected] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const [names, setNames] = React.useState(() => d.nameMap.map((m) => ({ ...m })));
  const [codes, setCodes] = React.useState(() => d.codeMap.map((m) => ({ ...m })));
  const [queue, setQueue] = React.useState(() =>
    (d.unresolved || []).map((u) => ({
      ...u,
      keyword: window.suggestKeyword(u.raw),
      branch: window.suggestKeyword(u.raw),
    }))
  );
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(null);

  const editGroup = (list, setList, key, keyField, group) => {
    setList(list.map((m) => (m[keyField] === key ? { ...m, group, status: group ? "mapped" : "unmapped" } : m)));
    setDirty(true);
    setSaved(null);
  };

  const addNew = () => {
    if (tab === "name") {
      const raw = window.prompt("Raw name exactly as it appears in the data:");
      if (!raw) return;
      setNames([{ raw: raw.trim(), group: "", status: "unmapped" }, ...names]);
    } else {
      const pattern = window.prompt("Invoice code or fragment:");
      if (!pattern) return;
      setCodes([{ pattern: pattern.trim(), group: "", match: "Fragment" }, ...codes]);
    }
    setDirty(true);
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (tab === "name") setNames(names.map((m) => (m.raw === selected ? { ...m, group: "", status: "unmapped", removed: true } : m)));
    else setCodes(codes.filter((m) => m.pattern !== selected));
    setSelected(null);
    setDirty(true);
  };

  async function save() {
    if (!live) return window.alert("Not connected to the API — start app/server.py to persist mappings.");
    setSaving(true);
    try {
      const res = await window.API.saveMappings({
        // An empty group is the delete signal on both layers.
        names: names.map((m) => ({ raw: m.raw, group: m.removed ? "" : m.group })),
        codes: codes.map((m) => ({ pattern: m.pattern, group: m.group, exact: m.match === "Exact" })),
      });
      // Apply the edit to the data already cleaned, so the reports move now.
      const applied = await window.API.remap();
      await window.API.boot();
      setSaved(
        `${res.names} name rules, ${res.codes} keyword rules saved · ` +
        `${applied.stats.unmappedRows.toLocaleString()} rows still unmapped`
      );
      setDirty(false);
      onSaved && onSaved();
    } catch (err) {
      setSaved(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  const editQueue = (raw, field, value) => {
    setQueue(queue.map((q) => (q.raw === raw ? { ...q, [field]: value } : q)));
  };

  /** Promote one unresolved name into a keyword rule. */
  const accept = (row) => {
    if (!row.keyword.trim() || !row.branch.trim()) return;
    setCodes([{ pattern: row.keyword.trim(), group: row.branch.trim(), match: "Fragment" }, ...codes]);
    setQueue(queue.filter((q) => q.raw !== row.raw));
    setDirty(true);
    setSaved(null);
  };

  const acceptAll = () => {
    const ready = queue.filter((q) => q.keyword.trim() && q.branch.trim());
    if (!ready.length) return;
    setCodes([
      ...ready.map((q) => ({ pattern: q.keyword.trim(), group: q.branch.trim(), match: "Fragment" })),
      ...codes,
    ]);
    setQueue(queue.filter((q) => !ready.includes(q)));
    setDirty(true);
    setSaved(null);
  };

  const match = (s) => !query || String(s).toLowerCase().includes(query.toLowerCase());
  const shownNames = names.filter((m) => match(m.raw) || match(m.group));
  const shownCodes = codes.filter((m) => match(m.pattern) || match(m.group));
  const shownQueue = queue.filter((q) => match(q.raw) || match(q.keyword) || match(q.branch));

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 16px", borderBottom: "1px solid var(--ink)" };
  const td = { padding: "12px 16px", fontSize: 14, borderBottom: "1px solid var(--hairline-soft)" };
  const input = { width: "100%", border: "1px solid var(--hairline)", background: "var(--canvas)", padding: "6px 10px", font: "inherit", fontSize: 14, fontWeight: 600, color: "var(--ink)" };

  return (
    <div>
      <PageHead kicker="Step 2 · reusable across uploads" title="Mapping Manager"
        actions={<>
          <GhostButton icon="plus" onClick={addNew}>Add new</GhostButton>
          <GhostButton icon="trash-2" onClick={deleteSelected} disabled={!selected}>Delete selected</GhostButton>
          <Button size="sm" onClick={save} disabled={saving || !dirty}>{saving ? "Saving…" : "Save mappings"}</Button>
        </>} />

      {saved && (
        <div style={{ marginBottom: 8, padding: "12px 20px", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", fontSize: 13, color: "var(--charcoal)" }}>{saved}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 8 }}>
        <Panel pad={0} title={null} actions={null}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)" }}>
            {[
              ["name", "Name → Group", names.length, false],
              ["code", "Keyword → Branch", codes.length, false],
              ["queue", "Unresolved", queue.length, queue.length > 0],
            ].map(([id, label, n, alert]) => (
              <button key={id} onClick={() => { setTab(id); setSelected(null); }} style={{ flex: 1, padding: "14px 20px", background: tab === id ? "var(--canvas)" : "var(--soft-cloud)", border: "none", borderBottom: tab === id ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 600, color: tab === id ? "var(--ink)" : "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {label}
                <span style={{ fontSize: 12, fontWeight: 600, color: alert ? "var(--canvas)" : "var(--mute)", background: alert ? "var(--sale)" : "transparent", padding: alert ? "1px 8px" : 0, borderRadius: "var(--radius-pill)" }}>{alert ? n : `(${n})`}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)", display: "flex", gap: 12, alignItems: "center" }}>
            <SearchPill placeholder={tab === "name" ? "Search raw names" : tab === "code" ? "Search keywords" : "Search unresolved"} width={260}
              value={query} onChange={(e) => setQuery(e.target.value)} />
            {tab === "queue" && queue.length > 0 && (
              <Button size="sm" variant="secondary" onClick={acceptAll}>Accept all {shownQueue.length === queue.length ? queue.length : ""}</Button>
            )}
            <span style={{ fontSize: 13, color: "var(--mute)", marginLeft: "auto" }}>
              {tab === "name"
                ? "Suggestions are drafted from chain prefixes — confirm or correct them."
                : tab === "code"
                ? "A keyword matches anywhere inside the code or the name. Longest keyword wins."
                : "Names no rule resolves. The keyword is prefilled from the name — correct it, or accept."}
            </span>
          </div>

          {tab === "name" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Raw name (as it appears in your data)</th><th style={th}>Group (canonical outlet)</th><th style={{ ...th, width: 120 }}>Status</th></tr></thead>
              <tbody>
                {shownNames.map((m) => (
                  <tr key={m.raw} onClick={() => setSelected(m.raw)} style={{ cursor: "pointer", background: selected === m.raw ? "var(--soft-cloud)" : "transparent", opacity: m.removed ? 0.45 : 1 }}>
                    <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>{m.raw}</td>
                    <td style={td}>
                      {live ? (
                        <input style={input} value={m.group} placeholder="— not set —"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => editGroup(names, setNames, m.raw, "raw", e.target.value)} />
                      ) : (
                        <span style={{ fontWeight: 600, color: m.group ? "var(--ink)" : "var(--sale)" }}>{m.group || "— not set —"}</span>
                      )}
                    </td>
                    <td style={td}><StatusTag status={m.removed ? "unmapped" : m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tab === "queue" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                <th style={th}>Raw name in your data</th><th style={{ ...th, width: 110 }}>Code</th>
                <th style={th}>Keyword</th><th style={th}>Branch name</th><th style={{ ...th, width: 90 }} />
              </tr></thead>
              <tbody>
                {shownQueue.map((q) => (
                  <tr key={q.raw}>
                    <td style={{ ...td, color: "var(--charcoal)" }}>{q.raw}</td>
                    <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontSize: 13, color: "var(--mute)" }}>{q.code || "—"}</td>
                    <td style={td}>
                      <input style={input} value={q.keyword} placeholder="keyword"
                        onChange={(e) => editQueue(q.raw, "keyword", e.target.value)} />
                    </td>
                    <td style={td}>
                      <input style={input} value={q.branch} placeholder="branch name"
                        onChange={(e) => editQueue(q.raw, "branch", e.target.value)} />
                    </td>
                    <td style={td}>
                      <GhostButton icon="check" onClick={() => accept(q)}>Add</GhostButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Keyword (matches code or name)</th><th style={th}>Branch name</th><th style={{ ...th, width: 120 }}>Match</th></tr></thead>
              <tbody>
                {shownCodes.map((m) => (
                  <tr key={m.pattern} onClick={() => setSelected(m.pattern)} style={{ cursor: "pointer", background: selected === m.pattern ? "var(--soft-cloud)" : "transparent" }}>
                    <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}>{m.pattern}</td>
                    <td style={td}>
                      {live ? (
                        <input style={input} value={m.group} placeholder="— not set —"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => editGroup(codes, setCodes, m.pattern, "pattern", e.target.value)} />
                      ) : (
                        <span style={{ fontWeight: 600 }}>{m.group}</span>
                      )}
                    </td>
                    <td style={{ ...td, fontSize: 13, color: "var(--mute)" }}>
                      {live ? (
                        <select value={m.match} onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { setCodes(codes.map((c) => (c.pattern === m.pattern ? { ...c, match: e.target.value } : c))); setDirty(true); }}
                          style={{ font: "inherit", fontSize: 13, padding: "4px 6px", border: "1px solid var(--hairline)", background: "var(--canvas)" }}>
                          <option>Exact</option><option>Fragment</option>
                        </select>
                      ) : m.match}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!shownNames.length && tab === "name" && (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>No raw names match “{query}”.</div>
          )}
          {tab === "queue" && !shownQueue.length && (
            <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--mute)", fontSize: 14 }}>
              {queue.length ? `Nothing matches “${query}”.` : "Every name resolves. Nothing left to map."}
            </div>
          )}
        </Panel>

        <Panel title="Why outlet names need mapping" pad={0}>
          <div style={{ padding: "16px 24px", fontSize: 14, lineHeight: 1.6, color: "var(--charcoal)", borderBottom: "1px solid var(--hairline-soft)" }}>
            The <strong>Name</strong> column is typed at the point of sale, so one retail chain arrives under dozens of spellings — and on some invoices it isn't a store name at all. Mapping collapses those variants onto one canonical outlet so totals are counted once.
          </div>

          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--hairline-soft)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 10 }}>Case 1 — many spellings, one chain</div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 10 }}>Use <strong>Name → Group</strong>.</div>
            <div style={{ background: "var(--soft-cloud)", padding: 14, fontSize: 13, fontFamily: "ui-monospace, monospace", lineHeight: 1.8 }}>
              ECONSAVE - AMPANG BARU<br />ECONSAVE - BAGAN SERAI<br />ECONSAVE - BATU GAJAH<br />
              <span style={{ color: "var(--mute)" }}>↓</span><br /><strong>ECONSAVE</strong>
            </div>
          </div>

          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--hairline-soft)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 10 }}>Case 2 — the name is a branch code</div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 10 }}>Use <strong>Code → Group</strong>. The <strong>Code</strong> column is the reliable key.</div>
            <div style={{ background: "var(--soft-cloud)", padding: 14, fontSize: 13, fontFamily: "ui-monospace, monospace", lineHeight: 1.8 }}>
              Name: 10068 AMPANG BARU<br />Code: 300-10042<br />
              <span style={{ color: "var(--mute)" }}>↓ matched on code</span><br /><strong>ECONSAVE</strong>
            </div>
            <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 12, lineHeight: 1.6 }}>
              Fragments work too: a rule on <code style={{ fontFamily: "ui-monospace, monospace" }}>SNWG</code> resolves any code containing it to Senawang.
            </div>
          </div>

          <div style={{ padding: "16px 24px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Icon name="info" size={17} color="var(--mute)" />
            <div style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.6 }}>
              Mappings persist and apply to every future upload. Rows unresolved after both layers are flagged in the Clean Data Table, never dropped.
              {!live && <><br /><strong>Read-only</strong> — editing needs the API running.</>}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { MappingScreen });
