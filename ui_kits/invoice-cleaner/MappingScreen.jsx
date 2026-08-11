const { Icon, Button, SearchPill } = window.SubtleGradientDesignSystem_21f929;

function MappingScreen() {
  const d = window.INVOICE;
  const [tab, setTab] = React.useState("name");
  const [selected, setSelected] = React.useState(null);

  const th = { textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", padding: "10px 16px", borderBottom: "1px solid var(--ink)" };
  const td = { padding: "12px 16px", fontSize: 14, borderBottom: "1px solid var(--hairline-soft)" };

  return (
    <div>
      <PageHead kicker="Step 2 · reusable across uploads" title="Mapping Manager"
        actions={<><GhostButton icon="plus">Add new</GhostButton><GhostButton icon="pencil">Edit selected</GhostButton><GhostButton icon="trash-2">Delete selected</GhostButton><Button size="sm">Save mappings</Button></>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 8 }}>
        <Panel pad={0} title={null} actions={null}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)" }}>
            {[["name", "Name → Group", d.nameMap.length], ["code", "Code → Group", d.codeMap.length]].map(([id, label, n]) => (
              <button key={id} onClick={() => { setTab(id); setSelected(null); }} style={{ flex: 1, padding: "14px 20px", background: tab === id ? "var(--canvas)" : "var(--soft-cloud)", border: "none", borderBottom: tab === id ? "2px solid var(--ink)" : "2px solid transparent", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 600, color: tab === id ? "var(--ink)" : "var(--mute)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {label}<span style={{ fontSize: 12, color: "var(--mute)", fontWeight: 500 }}>({n})</span>
              </button>
            ))}
          </div>

          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)", display: "flex", gap: 12, alignItems: "center" }}>
            <SearchPill placeholder={tab === "name" ? "Search raw names" : "Search codes"} width={260} />
            <span style={{ fontSize: 13, color: "var(--mute)", marginLeft: "auto" }}>
              {tab === "name" ? "Suggestions are drafted from chain prefixes — confirm or correct them." : "Fragment rules match anywhere inside a code."}
            </span>
          </div>

          {tab === "name" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Raw name (as it appears in your data)</th><th style={th}>Group (canonical outlet)</th><th style={{ ...th, width: 120 }}>Status</th></tr></thead>
              <tbody>
                {d.nameMap.map((m) => (
                  <tr key={m.raw} onClick={() => setSelected(m.raw)} style={{ cursor: "pointer", background: selected === m.raw ? "var(--soft-cloud)" : "transparent" }}>
                    <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>{m.raw}</td>
                    <td style={{ ...td, fontWeight: 600, color: m.group ? "var(--ink)" : "var(--sale)" }}>{m.group || "— not set —"}</td>
                    <td style={td}><StatusTag status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={th}>Invoice code / fragment</th><th style={th}>Canonical outlet</th><th style={{ ...th, width: 120 }}>Match</th></tr></thead>
              <tbody>
                {d.codeMap.map((m) => (
                  <tr key={m.pattern} onClick={() => setSelected(m.pattern)} style={{ cursor: "pointer", background: selected === m.pattern ? "var(--soft-cloud)" : "transparent" }}>
                    <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontVariantNumeric: "tabular-nums" }}>{m.pattern}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{m.group}</td>
                    <td style={{ ...td, fontSize: 13, color: "var(--mute)" }}>{m.match}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { MappingScreen });
