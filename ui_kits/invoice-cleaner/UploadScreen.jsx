const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

function UploadScreen({ onNavigate }) {
  const d = window.INVOICE;
  const [stage, setStage] = React.useState("parsed"); // idle | parsed | cleaning | clean
  const unmapped = d.nameMap.filter((m) => m.status !== "mapped").length;

  const runClean = () => {
    setStage("cleaning");
    setTimeout(() => setStage("clean"), 900);
  };

  return (
    <div>
      <PageHead kicker="Step 1" title="Upload & Clean" actions={stage === "clean" && <Button size="sm" onClick={() => onNavigate("table")}>View clean table</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div onClick={() => setStage("parsed")} style={{ border: "1px dashed var(--hairline)", background: "var(--soft-cloud)", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "center" }}>
            <Icon name="file-spreadsheet" size={32} color="var(--mute)" />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Drop the raw Invoice Listing export here</div>
            <div style={{ fontSize: 14, color: "var(--mute)", maxWidth: "52ch" }}>
              Accepts the paginated <strong>.xlsx</strong> dumped from the accounting system. Page banners, repeated headers and filter metadata are stripped automatically.
            </div>
            <div style={{ marginTop: 8 }}><Button size="sm" variant="secondary">Choose file</Button></div>
          </div>

          {stage !== "idle" && (
            <Panel title="Parse preview" note={`${d.file.name} · ${d.file.size}`} actions={<StatusTag status={unmapped ? "unmapped" : "mapped"} />}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                <StatCard label="Invoices" value={d.parse.invoices.toLocaleString()} />
                <StatCard label="Line items" value={d.parse.lineItems.toLocaleString()} />
                <StatCard label="Distinct raw names" value={d.parse.rawNames} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  ["Date range detected in file", "1 Jan 2026 – 31 Jul 2026"],
                  ["Wrapped descriptions stitched", d.parse.continuationRows + " rows"],
                  ["Page banners / headers discarded", d.parse.discardedRows.toLocaleString() + " rows"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--hairline-soft)", fontSize: 14 }}>
                    <span style={{ color: "var(--mute)" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, background: unmapped ? "#fff4f4" : "var(--soft-cloud)", border: `1px solid ${unmapped ? "var(--sale)" : "var(--hairline)"}`, padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <Icon name={unmapped ? "alert-triangle" : "check"} size={20} color={unmapped ? "var(--sale)" : "var(--success)"} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: unmapped ? "var(--sale)" : "var(--ink)" }}>
                    {unmapped} raw outlet names have no mapping
                  </div>
                  <div style={{ fontSize: 14, color: "var(--charcoal)", marginTop: 6, lineHeight: 1.5, maxWidth: "62ch" }}>
                    Unmapped names are what silently corrupt outlet totals — the same store gets counted twice under two spellings. Resolve them before cleaning, or clean now and review the flagged rows afterwards.
                  </div>
                </div>
                <Button size="sm" variant="secondary" onClick={() => onNavigate("mapping")}>Resolve</Button>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--hairline)" }}>
                <Button onClick={runClean}>{stage === "cleaning" ? "Cleaning…" : stage === "clean" ? "Re-run clean" : "Clean"}</Button>
                {stage === "clean" && (
                  <>
                    <StatusTag status="mapped" />
                    <span style={{ fontSize: 14, color: "var(--mute)" }}>{d.parse.lineItems.toLocaleString()} clean rows produced</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <GhostButton icon="download">CSV</GhostButton>
                      <GhostButton icon="download">XLSX</GhostButton>
                    </div>
                  </>
                )}
              </div>
            </Panel>
          )}
        </div>

        <Panel title="What the cleaner does" note="app/invoice_cleaner/parser.py" pad={0}>
          {[
            ["Classify every row", "Invoice header (IV-#####), line item (integer Seq), or report noise."],
            ["Stitch wrapped names", "A row holding only a Description cell is joined onto the product above it."],
            ["Carry invoice context down", "Doc No, date, code and raw name flow onto each line item below."],
            ["Resolve the outlet", "Name → Group first, then Code → Group when the name is numeric or missing."],
            ["Flag, never drop", "Anything unresolved keeps its raw value and is marked unmapped."],
          ].map(([t, b], i) => (
            <div key={t} style={{ display: "flex", gap: 14, padding: "16px 24px", borderBottom: "1px solid var(--hairline-soft)" }}>
              <span style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 18, color: "var(--stone)" }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4, lineHeight: 1.5 }}>{b}</div>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { UploadScreen });
