import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const STATUS_COLORS = {"not-started":"#4b5563","in-progress":"#f59e0b","complete":"#10b981"};
const STATUS_LABELS = {"not-started":"Not Started","in-progress":"In Progress","complete":"Complete"};

const Pill = ({color,children}) => (
  <span className="text-xs px-2 py-0.5 rounded-full font-mono border" style={{background:`${color}15`,color:color,borderColor:`${color}30`}}>{children}</span>
);

function shortTitle(role) {
  if (!role) return "?";
  const t = role.title;
  if (t.includes("Consumer")) return "Consumer PM";
  if (t.includes("Claude Code")) return "Claude Code PM";
  if (t.includes("People Products")) return "People EM";
  if (t.includes("Digital Human")) return "DHT TPM";
  if (t.includes("Planning & Controls")) return "AV Planning";
  if (t.includes("UI Software")) return "UI Eng";
  if (t.includes("AV Testing")) return "AV Testing EM";
  return t.split(",")[0];
}

function RolePill({ role }) {
  const [show, setShow] = useState(false);
  if (!role) return null;
  const fitVal = parseInt(role.fit);
  const fitColor = fitVal >= 85 ? "#10b981" : fitVal >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => { e.stopPropagation(); setShow(s => !s); }}
    >
      <span className="text-xs px-2 py-0.5 rounded-full font-mono border cursor-default"
        style={{ background: `${role.color}15`, color: role.color, borderColor: `${role.color}30` }}>
        {shortTitle(role)}
      </span>
      {show && (
        <span className="absolute z-50 left-1/2 bottom-full mb-2 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
          <span className="block bg-[#1a1a1a] border border-white/15 rounded-lg p-3 shadow-xl whitespace-nowrap text-left" style={{ minWidth: 180 }}>
            <span className="block text-white text-xs font-medium mb-1">{role.title}</span>
            <span className="block text-gray-400 text-[11px] font-mono">{role.company}</span>
            <span className="block text-gray-400 text-[11px] font-mono mt-0.5">{role.comp}</span>
            <span className="block text-[11px] font-mono mt-1" style={{ color: fitColor }}>{role.fit} fit</span>
          </span>
        </span>
      )}
    </span>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────
function ActivityTab({ notes, onAddNote }) {
  const [text, setText] = useState("");
  const feedEnd = useRef(null);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes.length]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2" style={{ minHeight: 0 }}>
        {notes.length === 0 && (
          <div className="text-gray-600 text-sm text-center py-12">No notes yet. Add your first note below.</div>
        )}
        {notes.map(n => (
          <div key={n.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="text-gray-300 text-sm whitespace-pre-wrap">{n.text}</div>
            <div className="text-gray-600 text-xs font-mono mt-2">
              {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" "}
              {new Date(n.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </div>
          </div>
        ))}
        <div ref={feedEnd} />
      </div>
      <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Add a note... (Enter to send, Shift+Enter for newline)"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-amber-500/40"
          rows={2}
        />
        <button
          onClick={submit}
          className="px-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-mono hover:bg-amber-500/30 transition-colors self-end"
          style={{ height: 40 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────
function TasksTab({ tasks, roles, roleId, onAddTask, onUpdateTask }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("project");
  const [priority, setPriority] = useState("high");
  const [desc, setDesc] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([roleId]);

  const resetForm = () => {
    setTitle(""); setType("project"); setPriority("high"); setDesc(""); setSelectedRoles([roleId]); setShowForm(false);
  };

  const submit = () => {
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      type,
      priority,
      desc: desc.trim(),
      roles: selectedRoles,
      status: "not-started",
    });
    resetForm();
  };

  const toggleRole = (rid) => {
    setSelectedRoles(prev =>
      prev.includes(rid) ? prev.filter(r => r !== rid) : [...prev, rid]
    );
  };

  const cycleStatus = (task) => {
    const order = ["not-started", "in-progress", "complete"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdateTask(task.id, { status: next });
  };

  const roleTasks = tasks.filter(t => t.roles.includes(roleId));
  const sorted = [...roleTasks].sort((a, b) => {
    const pOrd = { high: 0, medium: 1, low: 2 };
    const sOrd = { "in-progress": 0, "not-started": 1, "complete": 2 };
    return (sOrd[a.status] ?? 1) - (sOrd[b.status] ?? 1) || (pOrd[a.priority] ?? 1) - (pOrd[b.priority] ?? 1);
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs tracking-widest text-amber-400 font-mono">
          TASKS ({roleTasks.length})
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 border border-amber-500/20 rounded-lg p-4 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40"
          />
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40"
          />
          <div className="flex gap-3">
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1">TYPE</div>
              <div className="flex gap-1">
                {["project", "learning"].map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-colors ${type === t ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"}`}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono mb-1">PRIORITY</div>
              <div className="flex gap-1">
                {["high", "medium", "low"].map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-colors ${priority === p ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300"}`}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-mono mb-1">APPLIES TO ROLES (click to toggle)</div>
            <div className="flex gap-1 flex-wrap">
              {roles.map(r => (
                <button key={r.id} onClick={() => toggleRole(r.id)}
                  className={`text-xs px-2 py-1 rounded-full font-mono border transition-colors ${selectedRoles.includes(r.id) ? "border-opacity-60 text-white" : "border-white/10 text-gray-600 hover:text-gray-400"}`}
                  style={selectedRoles.includes(r.id) ? { background: `${r.color}20`, borderColor: `${r.color}50`, color: r.color } : {}}
                >{r.company} · {r.title.split(",")[0]}</button>
              ))}
            </div>
          </div>
          <button onClick={submit}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-mono hover:bg-amber-500/30 transition-colors"
          >Create Task</button>
        </div>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="text-gray-600 text-sm text-center py-12">No tasks for this role yet.</div>
      )}

      {sorted.map(t => (
        <div key={t.id} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/[0.07] transition-colors">
          <button onClick={() => cycleStatus(t)} className="mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ borderColor: STATUS_COLORS[t.status], background: t.status === "complete" ? STATUS_COLORS[t.status] : "transparent" }}
            title="Click to cycle status"
          >
            {t.status === "complete" && <span className="text-white text-[8px]">✓</span>}
            {t.status === "in-progress" && <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[t.status] }} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium ${t.status === "complete" ? "text-gray-500 line-through" : "text-white"}`}>{t.title}</div>
            {t.desc && <div className="text-gray-500 text-xs mt-0.5">{t.desc}</div>}
            <div className="flex gap-1 mt-2 flex-wrap">
              <Pill color={t.type === "project" ? "#3b82f6" : "#8b5cf6"}>{t.type}</Pill>
              <Pill color={t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "#f59e0b" : "#6b7280"}>{t.priority}</Pill>
              {t.roles.length > 1 && (
                <Pill color="#10b981">{t.roles.length}x return</Pill>
              )}
              {t.roles.filter(rid => rid !== roleId).map(rid => {
                const r = roles.find(x => x.id === rid);
                return r ? <RolePill key={rid} role={r} /> : null;
              })}
            </div>
          </div>
          <Pill color={STATUS_COLORS[t.status]}>{STATUS_LABELS[t.status]}</Pill>
        </div>
      ))}
    </div>
  );
}

// ─── Brief Tab ────────────────────────────────────────────────
function BriefTab({ BriefComponent }) {
  if (!BriefComponent) {
    return <div className="text-gray-600 text-sm text-center py-12">No brief available for this role.</div>;
  }
  return (
    <div className="brief-embed">
      <BriefComponent />
    </div>
  );
}

// ─── Role Detail Page ─────────────────────────────────────────
export default function RoleDetail({ roles, tasks, notes, onAddNote, onAddTask, onUpdateTask, briefComponents }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState("activity");
  const role = roles.find(r => r.id === id);

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-4">Role not found</div>
          <button onClick={() => navigate("/")} className="text-amber-400 text-sm font-mono hover:underline">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const roleNotes = notes.filter(n => n.roleId === id).sort((a, b) => a.createdAt - b.createdAt);
  const BriefComponent = briefComponents[role.id] || null;

  const subTabs = [
    { id: "activity", label: "Activity", count: roleNotes.length },
    { id: "tasks", label: "Tasks", count: tasks.filter(t => t.roles.includes(id)).length },
    { id: "brief", label: "Brief" },
  ];

  const fitColor = parseInt(role.fit) >= 85 ? "#10b981" : parseInt(role.fit) >= 60 ? "#f59e0b" : "#ef4444";
  const statusColors = { prep: "#10b981", research: "#f59e0b", watching: "#6b7280", applied: "#3b82f6", interviewing: "#8b5cf6" };
  const statusLabels = { prep: "Prepping", research: "Researching", watching: "Watching", applied: "Applied", interviewing: "Interviewing" };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg,#070707 0%,#0d0d0d 50%,#080808 100%)", fontFamily: "'DM Sans',sans-serif" }}>
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-gray-500 hover:text-white transition-colors text-sm font-mono flex items-center gap-2">
            <span>←</span> Dashboard
          </button>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: role.color }} />
            <span className="text-white font-medium">{role.company} · {role.title}</span>
          </div>
          <span className="text-gray-600 font-mono text-xs ml-auto">#{role.priority}</span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, minHeight: "calc(100vh - 160px)" }}>
          {/* Left Rail */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-xs text-gray-500 font-mono mb-1">COMPENSATION</div>
                <div className="text-white text-sm">{role.comp}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono mb-1">LOCATION</div>
                <div className="text-white text-sm">{role.loc}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono mb-1">FIT</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium" style={{ color: fitColor }}>{role.fit}</div>
                  <Pill color={statusColors[role.status] || "#6b7280"}>{statusLabels[role.status] || role.status}</Pill>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono mb-1">TAGS</div>
                <div className="flex gap-1 flex-wrap">
                  {role.tags.map(t => <Pill key={t} color="#6b7280">{t}</Pill>)}
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3">
              <div className="text-xs tracking-widest text-emerald-400 font-mono mb-1">VERDICT</div>
              <div className="text-emerald-200 text-sm">{role.verdict}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-xs tracking-widest text-emerald-400 font-mono mb-2">STRENGTHS</div>
              {role.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                  <span className="text-gray-300 text-xs">{s}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-xs tracking-widest text-red-400 font-mono mb-2">GAPS</div>
              {role.gaps.map((g, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <Pill color={g.s === "HIGH" ? "#ef4444" : g.s === "MEDIUM" ? "#f59e0b" : "#10b981"}>{g.s}</Pill>
                  <span className="text-gray-300 text-xs">{g.g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col" style={{ minHeight: 0 }}>
            {/* Sub-tabs */}
            <div className="border-b border-white/8 flex gap-1 mb-4">
              {subTabs.map(t => (
                <button key={t.id} onClick={() => setSubTab(t.id)}
                  className={`px-4 py-2 text-sm font-mono transition-all border-b-2 ${subTab === t.id ? "text-white border-amber-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}
                >
                  {t.label}
                  {t.count !== undefined && <span className="ml-1.5 text-xs opacity-60">({t.count})</span>}
                </button>
              ))}
            </div>

            {/* Sub-tab Content */}
            <div className="flex-1" style={{ minHeight: 400 }}>
              {subTab === "activity" && (
                <ActivityTab
                  notes={roleNotes}
                  onAddNote={(text) => onAddNote(id, text)}
                />
              )}
              {subTab === "tasks" && (
                <TasksTab
                  tasks={tasks}
                  roles={roles}
                  roleId={id}
                  onAddTask={onAddTask}
                  onUpdateTask={onUpdateTask}
                />
              )}
              {subTab === "brief" && (
                <BriefTab BriefComponent={BriefComponent} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
