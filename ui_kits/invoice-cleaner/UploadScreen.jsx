const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

const fmtBytes = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB");

function UploadScreen({ onNavigate, onCleaned }) {
  const d = window.INVOICE;
  const live = window.API.live || window.API.empty;

  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(live ? null : d.parse);
  const [stage, setStage] = React.useState(live ? "idle" : "parsed"); // idle|parsing|parsed|cleaning|clean|error
  const [error, setError] = React.useState(null);
  const [cleanedRows, setCleanedRows] = React.useState(0);
  const [seed, setSeed] = React.useState(true);
  const inputRef = React.useRef(null);

  // Offline the sample stands in; live it comes from the parse response.
  const unmappedNames = live
    ? (preview ? preview.unmappedNames : [])
    : d.nameMap.filter((m) => m.status !== "mapped").map((m) => m.raw);
  const unmapped = unmappedNames.length;

  async function choose(f) {
    if (!f) return;
    setFile(f);
    setError(null);
    setCleanedRows(0);
    if (!live) return setStage("parsed"); // offline: the sample preview stands in
    setStage("parsing");
    try {
      setPreview(await window.API.upload(f));
      setStage("parsed");
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }

  async function runClean() {
    if (!live) {
      setStage("cleaning");
      return setTimeout(() => setStage("clean"), 900);
    }
    if (!file) return;
    setStage("cleaning");
    setError(null);
    try {
      const res = await window.API.clean(file, { seed });
      setCleanedRows(res.rows);
      await window.API.boot(); // pull the new dataset into every other screen
      setStage("clean");
      onCleaned && onCleaned();
    } catch (err) {
      setError(err.message);
      setStage("error");
    }
  }

  const onDrop = (e) => {
    e.preventDefault();
    choose(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const rangeLabel = () => {
    if (!live) return "1 Jan 2026 – 31 Jul 2026";
    if (!preview) return "—";
    if (preview.reportedRange) return `${preview.reportedRange[0]} – ${preview.reportedRange[1]}`;
    if (preview.dateFrom && preview.dateTo) return `${preview.dateFrom} – ${preview.dateTo}`;
    return "Not stated in the file";
  };

  return (
    <div>
      <PageHead kicker="Step 1" title="Upload & Clean" actions={stage === "clean" && <Button size="sm" onClick={() => onNavigate("table")}>View clean table</Button>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }}
            onChange={(e) => choose(e.target.files && e.target.files[0])} />

          <div onClick={() => inputRef.current && inputRef.current.click()} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}
            style={{ border: "1px dashed var(--hairline)", background: "var(--soft-cloud)", padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "center" }}>
            <Icon name="file-spreadsheet" size={32} color="var(--mute)" />
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {file ? file.name : "Drop the raw Invoice Listing export here"}
            </div>
            <div style={{ fontSize: 14, color: "var(--mute)", maxWidth: "52ch" }}>
              {file
                ? `${fmtBytes(file.size)} · click to choose a different file`
                : <>Accepts the paginated <strong>.xlsx</strong> dumped from the accounting system. Page banners, repeated headers and filter metadata are stripped automatically.</>}
            </div>
            <div style={{ marginTop: 8 }}><Button size="sm" variant="secondary">Choose file</Button></div>
          </div>

          {stage === "parsing" && (
            <Panel title="Parsing…"><div style={{ color: "var(--mute)", fontSize: 14 }}>Classifying rows and detecting the reported date range.</div></Panel>
          )}

          {error && (
            <Panel title="That file could not be parsed">
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Icon name="alert-triangle" size={20} color="var(--sale)" />
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--charcoal)" }}>
                  <div style={{ fontWeight: 600, color: "var(--sale)", marginBottom: 6 }}>{error}</div>
                  Check that this is the raw Invoice Listing export, saved as .xlsx, with the original columns intact.
                </div>
              </div>
            </Panel>
          )}

          {preview && (stage === "parsed" || stage === "cleaning" || stage === "clean") && (
            <Panel title="Parse preview"
              note={file ? `${file.name} · ${fmtBytes(file.size)}` : `${d.file.name} · ${d.file.size}`}
              actions={<StatusTag status={unmapped ? "unmapped" : "mapped"} />}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                <StatCard label="Invoices" value={preview.invoices.toLocaleString()} />
                <StatCard label="Line items" value={preview.lineItems.toLocaleString()} />
                <StatCard label="Distinct raw names" value={preview.rawNames} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  ["Date range detected in file", rangeLabel()],
                  ["Wrapped descriptions stitched", preview.continuationRows + " rows"],
                  ["Page banners / headers discarded", preview.discardedRows.toLocaleString() + " rows"],
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
                    {unmapped
                      ? unmapped === 1
                        ? "1 raw outlet name has no mapping"
                        : `${unmapped} raw outlet names have no mapping`
                      : "Every raw outlet name resolves"}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--charcoal)", marginTop: 6, lineHeight: 1.5, maxWidth: "62ch" }}>
                    Unmapped names are what silently corrupt outlet totals — the same store gets counted twice under two spellings. Resolve them before cleaning, or clean now and review the flagged rows afterwards.
                  </div>
                  {unmapped > 0 && (
                    <div style={{ marginTop: 10, fontSize: 13, fontFamily: "ui-monospace, monospace", color: "var(--mute)", lineHeight: 1.7 }}>
                      {unmappedNames.slice(0, 5).join(" · ")}
                      {unmapped > 5 && ` · +${unmapped - 5} more`}
                    </div>
                  )}
                </div>
                <Button size="sm" variant="secondary" onClick={() => onNavigate("mapping")}>Resolve</Button>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--hairline)" }}>
                <Button onClick={runClean}>{stage === "cleaning" ? "Cleaning…" : stage === "clean" ? "Re-run clean" : "Clean"}</Button>
                {live && (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--charcoal)", cursor: "pointer" }}>
                    <input type="checkbox" checked={seed} onChange={(e) => setSeed(e.target.checked)} />
                    Seed draft mappings from chain prefixes
                  </label>
                )}
                {stage === "clean" && (
                  <>
                    <StatusTag status="mapped" />
                    <span style={{ fontSize: 14, color: "var(--mute)" }}>
                      {(live ? cleanedRows : preview.lineItems).toLocaleString()} clean rows produced
                    </span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <GhostButton icon="download" href={live ? window.API.exportUrl("csv") : null} disabled={!live}>CSV</GhostButton>
                      <GhostButton icon="download" href={live ? window.API.exportUrl("xlsx") : null} disabled={!live}>XLSX</GhostButton>
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
