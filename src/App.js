import { useState } from "react";

const SPRINTS = ["Sprint 1", "Sprint 2", "Sprint 3", "Backlog"];

const INITIAL_ISSUES = [
  { id: "PROJ-1", sprint: "Sprint 1", type: "Bug", summary: "Login page crashes on Safari mobile", assignee: "Alex K.", priority: "High", status: "Done" },
  { id: "PROJ-2", sprint: "Sprint 1", type: "Story", summary: "User can reset password via email link", assignee: "Maria S.", priority: "Medium", status: "Done" },
  { id: "PROJ-3", sprint: "Sprint 1", type: "Enhancement", summary: "Add dark mode toggle to settings panel", assignee: "Tom R.", priority: "Low", status: "Done" },
  { id: "PROJ-4", sprint: "Sprint 1", type: "Bug", summary: "Notifications badge count incorrect after read", assignee: "Alex K.", priority: "Medium", status: "Done" },
  { id: "PROJ-5", sprint: "Sprint 2", type: "Story", summary: "Users can upload profile avatars", assignee: "Maria S.", priority: "Medium", status: "Done" },
  { id: "PROJ-6", sprint: "Sprint 2", type: "Bug", summary: "File upload fails silently above 5MB", assignee: "Tom R.", priority: "High", status: "Done" },
  { id: "PROJ-7", sprint: "Sprint 2", type: "Enhancement", summary: "Keyboard shortcuts for common actions", assignee: "Sam L.", priority: "Low", status: "In Progress" },
  { id: "PROJ-8", sprint: "Sprint 2", type: "Story", summary: "Activity feed on dashboard homepage", assignee: "Alex K.", priority: "High", status: "In Progress" },
  { id: "PROJ-9", sprint: "Sprint 3", type: "Bug", summary: "Search results pagination breaks on page 3+", assignee: "Maria S.", priority: "High", status: "In Progress" },
  { id: "PROJ-10", sprint: "Sprint 3", type: "Enhancement", summary: "Export data to CSV from any table view", assignee: "Tom R.", priority: "Medium", status: "To Do" },
  { id: "PROJ-11", sprint: "Sprint 3", type: "Story", summary: "Team admin can manage member roles", assignee: "Sam L.", priority: "High", status: "To Do" },
  { id: "PROJ-12", sprint: "Sprint 3", type: "Bug", summary: "Tooltip overlaps modal on small screens", assignee: "Alex K.", priority: "Low", status: "Blocked" },
  { id: "PROJ-13", sprint: "Sprint 3", type: "Story", summary: "Audit log for admin user actions", assignee: "Maria S.", priority: "Medium", status: "To Do" },
  { id: "PROJ-14", sprint: "Backlog", type: "Enhancement", summary: "AI-powered smart search suggestions", assignee: "Unassigned", priority: "Low", status: "To Do" },
  { id: "PROJ-15", sprint: "Backlog", type: "Story", summary: "Mobile app push notifications", assignee: "Unassigned", priority: "Medium", status: "To Do" },
  { id: "PROJ-16", sprint: "Backlog", type: "Bug", summary: "Session timeout warning not shown", assignee: "Sam L.", priority: "High", status: "To Do" },
];

// --- Badge helpers ---
function TypeBadge({ type }) {
  const styles = {
    Bug: { background: "#FCEBEB", color: "#A32D2D" },
    Story: { background: "#E6F1FB", color: "#185FA5" },
    Enhancement: { background: "#EAF3DE", color: "#3B6D11" },
  };
  return (
    <span style={{ ...badge, ...styles[type] }}>{type}</span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "To Do": { background: "#F1EFE8", color: "#5F5E5A" },
    "In Progress": { background: "#FAEEDA", color: "#854F0B" },
    Done: { background: "#EAF3DE", color: "#3B6D11" },
    Blocked: { background: "#FCEBEB", color: "#A32D2D" },
  };
  return (
    <span style={{ ...badge, ...styles[status] }}>{status}</span>
  );
}

function PriorityIcon({ priority }) {
  const map = { High: { symbol: "▲", color: "#E24B4A" }, Medium: { symbol: "●", color: "#EF9F27" }, Low: { symbol: "▼", color: "#378ADD" } };
  const { symbol, color } = map[priority];
  return <span title={priority} style={{ color, fontSize: 13 }}>{symbol}</span>;
}

// --- Shared styles ---
const badge = { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 100 };

const inputStyle = {
  width: "100%", fontSize: 13, padding: "7px 10px",
  border: "1px solid #ddd", borderRadius: 8,
  background: "#fff", color: "#111", outline: "none",
};

// --- Modal ---
function IssueModal({ issue, onClose, onSave }) {
  const [form, setForm] = useState(
    issue || { sprint: SPRINTS[0], type: "Bug", summary: "", assignee: "", priority: "Medium", status: "To Do" }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.summary.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
    >
      <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: 24, width: 400, maxWidth: "95vw" }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: "#111" }}>{issue ? "Edit issue" : "Add issue"}</h3>

        {[
          { label: "Sprint", key: "sprint", type: "select", options: SPRINTS },
          { label: "Type", key: "type", type: "select", options: ["Bug", "Story", "Enhancement"] },
          { label: "Summary", key: "summary", type: "text", placeholder: "Brief description..." },
          { label: "Assignee", key: "assignee", type: "text", placeholder: "e.g. Jane D." },
          { label: "Priority", key: "priority", type: "select", options: ["High", "Medium", "Low"] },
          { label: "Status", key: "status", type: "select", options: ["To Do", "In Progress", "Done", "Blocked"] },
        ].map(({ label, key, type, options, placeholder }) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</label>
            {type === "select" ? (
              <select value={form[key]} onChange={(e) => set(key, e.target.value)} style={inputStyle}>
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type="text" value={form[key]} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} style={inputStyle} />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button onClick={onClose} style={{ fontSize: 13, padding: "7px 16px", background: "transparent", border: "1px solid #ddd", borderRadius: 8, color: "#666", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ fontSize: 13, padding: "7px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// --- Sprint Block ---
function SprintBlock({ sprint, issues, onEdit }) {
  const [open, setOpen] = useState(true);
  const allForSprint = issues; // already filtered to this sprint externally if needed

  return (
    <div style={{ marginBottom: 16, border: "1px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f9f9f7", cursor: "pointer", userSelect: "none" }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{sprint}</span>
        <span style={{ fontSize: 12, color: "#888" }}>
          {allForSprint.filter((i) => i.status === "Done").length}/{allForSprint.length} done
          &nbsp;&nbsp;
          <span style={{ color: open ? "#111" : "#aaa" }}>{open ? "▼" : "▶"}</span>
        </span>
      </div>

      {open && (
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              {["Key", "Type", "Summary", "Assignee", "Priority", "Status"].map((h) => (
                <th key={h} style={{ fontSize: 11, fontWeight: 500, color: "#888", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allForSprint.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: "center", fontSize: 13, color: "#bbb" }}>No issues match filters</td></tr>
            ) : (
              allForSprint.map((issue) => (
                <tr key={issue.id} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"} onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "9px 12px", width: 90 }}>
                    <span onClick={() => onEdit(issue)} style={{ fontSize: 12, fontFamily: "monospace", color: "#185FA5", cursor: "pointer" }}>{issue.id}</span>
                  </td>
                  <td style={{ padding: "9px 12px", width: 110 }}><TypeBadge type={issue.type} /></td>
                  <td style={{ padding: "9px 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "#111" }}>{issue.summary}</td>
                  <td style={{ padding: "9px 12px", width: 110, fontSize: 12, color: "#888" }}>{issue.assignee}</td>
                  <td style={{ padding: "9px 12px", width: 80 }}><PriorityIcon priority={issue.priority} /></td>
                  <td style={{ padding: "9px 12px", width: 120 }}><StatusBadge status={issue.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [counter, setCounter] = useState(17);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "add" | "edit", issue?: object }

  const filtered = issues.filter((i) =>
    (!search || i.summary.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()) || i.assignee.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || i.type === filterType) &&
    (!filterStatus || i.status === filterStatus) &&
    (!filterPriority || i.priority === filterPriority)
  );

  const handleSave = (form) => {
    if (modal.mode === "edit") {
      setIssues((prev) => prev.map((i) => (i.id === modal.issue.id ? { ...i, ...form } : i)));
    } else {
      const newId = `PROJ-${counter}`;
      setCounter((c) => c + 1);
      setIssues((prev) => [...prev, { id: newId, ...form, assignee: form.assignee || "Unassigned" }]);
    }
  };

  const stats = [
    { label: "Total", value: filtered.length },
    { label: "Bugs", value: filtered.filter((i) => i.type === "Bug").length },
    { label: "Stories", value: filtered.filter((i) => i.type === "Story").length },
    { label: "Enhancements", value: filtered.filter((i) => i.type === "Enhancement").length },
    { label: "Done", value: filtered.filter((i) => i.status === "Done").length },
  ];

  const selectStyle = { fontSize: 13, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", color: "#111", cursor: "pointer" };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, color: "#111" }}>Task Manager</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginBottom: 16 }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#111" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...selectStyle, flex: 1, minWidth: 160 }}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
          <option value="">All types</option>
          {["Bug", "Story", "Enhancement"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">All statuses</option>
          {["To Do", "In Progress", "Done", "Blocked"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={selectStyle}>
          <option value="">All priorities</option>
          {["High", "Medium", "Low"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <button onClick={() => setModal({ mode: "add" })} style={{ fontSize: 13, padding: "6px 14px", background: "#fff", border: "1px solid #ddd", borderRadius: 8, color: "#111", cursor: "pointer", whiteSpace: "nowrap" }}>
          + Add issue
        </button>
      </div>

      {/* Sprint blocks */}
      {SPRINTS.map((sprint) => (
        <SprintBlock
          key={sprint}
          sprint={sprint}
          issues={filtered.filter((i) => i.sprint === sprint)}
          onEdit={(issue) => setModal({ mode: "edit", issue })}
        />
      ))}

      {/* Modal */}
      {modal && (
        <IssueModal
          issue={modal.mode === "edit" ? modal.issue : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
