const { Icon, Button } = window.SubtleGradientDesignSystem_21f929;

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "upload", label: "Upload & Clean", icon: "upload" },
  { id: "mapping", label: "Mapping Manager", icon: "git-merge" },
  { id: "table", label: "Clean Data Table", icon: "table" },
  { id: "reports", label: "Reports", icon: "bar-chart-3" },
  { id: "tree", label: "Decomposition", icon: "git-fork" },
];

// A little sweeping broom beside the wordmark: white handle, teal bristle fan.
function BroomMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" style={{ flex: "0 0 auto" }} aria-hidden="true">
      <path d="M40 7 L25 24" stroke="var(--canvas)" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M19 24.5 L28.5 26.5" stroke="#0a7281" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M19 25 L28.5 27 L20 44 L9 34 Z" fill="#0a7281" />
      <g stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" opacity="0.5">
        <path d="M22 27 L13.5 36" />
        <path d="M24.3 28 L16 39.5" />
        <path d="M26 28.5 L18.5 43" />
      </g>
    </svg>
  );
}

function Sidebar({ view, onNavigate, unmapped }) {
  return (
    <aside style={{ width: 264, flex: "0 0 auto", background: "var(--ink)", color: "var(--canvas)", display: "flex", flexDirection: "column", padding: "24px 0", minHeight: "100vh" }}>
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid var(--ash)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BroomMark />
          <div style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "0.01em", textTransform: "uppercase", lineHeight: 1.02 }}>Clean<br />Sight</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--stone)", marginTop: 10 }}>Internal tool</div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2 }}>
        {NAV.map((n) => {
          const on = n.id === view;
          return (
            <button key={n.id} className={on ? "" : "navitem"} onClick={() => onNavigate(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", background: on ? "var(--canvas)" : "transparent", color: on ? "var(--ink)" : "var(--hairline)", border: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 500, textAlign: "left", borderRadius: 0 }}>
              <Icon name={n.icon} size={18} />
              {n.label}
              {n.id === "mapping" && unmapped > 0 && (
                <span style={{ marginLeft: "auto", background: "var(--sale)", color: "var(--canvas)", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-pill)" }}>{unmapped}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: "16px 24px 0", borderTop: "1px solid var(--ash)", fontSize: 12, lineHeight: 1.6, color: "var(--stone)" }}>
        <div style={{ fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Active dataset</div>
        <div style={{ color: "var(--hairline)" }}>
          {window.INVOICE.file ? window.INVOICE.file.name : `${(window.INVOICE.total || 0).toLocaleString()} cleaned rows`}
        </div>
        <div>{window.INVOICE.stats.period || "No period detected"}</div>
      </div>
    </aside>
  );
}

function PageHead({ title, kicker, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, paddingBottom: 18, borderBottom: "1px solid var(--ink)", marginBottom: 24 }}>
      <div>
        {kicker && <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)", marginBottom: 8 }}>{kicker}</div>}
        <h1 style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.01em", textTransform: "uppercase", lineHeight: 1 }}>{title}</h1>
      </div>
      {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
    </div>
  );
}

function StatCard({ label, value, sub, tone = "soft" }) {
  const dark = tone === "ink";
  const accent = tone !== "ink" && tone !== "soft" ? tone : null;
  return (
    <div className="statcard" style={{ background: dark ? "var(--ink)" : "var(--soft-cloud)", color: dark ? "var(--canvas)" : "var(--ink)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10, borderLeft: accent ? `4px solid ${accent}` : "none" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: dark ? "var(--stone)" : "var(--mute)" }}>{label}</div>
      <div style={{ fontFamily: "'Archivo Narrow', Archivo, sans-serif", fontWeight: 700, fontSize: 34, lineHeight: 1, letterSpacing: "-0.01em" }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: dark ? "var(--hairline)" : "var(--mute)", borderTop: dark ? "1px solid var(--ash)" : "1px solid var(--hairline)", paddingTop: 10 }}>{sub}</div>}
    </div>
  );
}

function Panel({ title, note, actions, children, pad = 24 }) {
  return (
    <section style={{ border: "1px solid var(--hairline)", background: "var(--canvas)" }}>
      {(title || actions) && (
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 24px", borderBottom: "1px solid var(--hairline)" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
            {note && <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>{note}</div>}
          </div>
          {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

function StatusTag({ status }) {
  const map = {
    "mapped-name": { fg: "var(--success)", label: "Name" },
    "mapped-code": { fg: "var(--info)", label: "Code" },
    mapped: { fg: "var(--success)", label: "Mapped" },
    suggested: { fg: "var(--mute)", label: "Suggested" },
    unmapped: { fg: "var(--sale)", label: "Unmapped" },
  };
  const s = map[status] || map.unmapped;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: s.fg, whiteSpace: "nowrap" }}>
      <span style={{ width: 8, height: 8, borderRadius: 9999, background: s.fg }} />
      {s.label}
    </span>
  );
}

function GhostButton({ children, icon, onClick, href, disabled }) {
  const style = { display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 16px", background: "var(--canvas)", color: disabled ? "var(--stone)" : "var(--ink)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-pill)", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none" };
  const inner = <>{icon && <Icon name={icon} size={15} />}{children}</>;
  // Downloads have to be real navigations, so exports render as anchors.
  if (href && !disabled) return <a className="hoverable" href={href} style={style}>{inner}</a>;
  return <button className="hoverable" onClick={onClick} disabled={disabled} style={style}>{inner}</button>;
}

/**
 * Says where the numbers on screen came from. Silent when the API is live; the
 * loud case is "the server isn't running" — the usual cause of an error after
 * the app has sat idle and the python process was stopped.
 */
function SourceBanner({ onNavigate }) {
  if (window.API && window.API.live) return null;
  if (window.API && window.API.serverDown) {
    return (
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff4f4", border: "1px solid var(--sale)", borderLeft: "3px solid var(--sale)", padding: "14px 20px", marginBottom: 24 }}>
        <Icon name="alert-triangle" size={18} color="var(--sale)" />
        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.6, color: "var(--charcoal)" }}>
          <strong style={{ color: "var(--sale)" }}>Can’t reach the server.</strong>{" "}
          It usually stops when the computer sleeps or the terminal closes. Start it again, then reload this page:
          <div style={{ marginTop: 8, fontFamily: "ui-monospace, monospace", fontSize: 12, background: "var(--soft-cloud)", padding: "8px 10px", border: "1px solid var(--hairline)" }}>
            cd Data-Cleaning-System-WMG-<br />.venv\Scripts\python.exe app\server.py
          </div>
        </div>
        <Button size="sm" onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }
  return null;
}

function Select({ value, onChange, options, label }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mute)" }}>{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ height: 40, minWidth: 180, padding: "0 12px", background: "var(--soft-cloud)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-search)", fontFamily: "Archivo, sans-serif", fontSize: 14, color: "var(--ink)", cursor: "pointer" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

Object.assign(window, { Sidebar, PageHead, StatCard, Panel, StatusTag, GhostButton, SourceBanner, Select, NAV });
