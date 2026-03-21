import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// DATA: All roles, learning tasks, projects — edit this to update
// ═══════════════════════════════════════════════════════════════

const ROLES = [
  { id:"anthropic-consumer-pm", company:"Anthropic", title:"Product Manager, Consumer", comp:"$385K–$460K", fit:"95%", priority:1, status:"prep", loc:"SF / NYC", tags:["PM","Consumer","Founder-fit","0-to-1"], brief:"anthropic-consumer-pm-brief.jsx", color:"#10b981",
    strengths:["Former consumer founder","Prototypes with Claude daily","0-to-1 DNA","Deep technical background","Obsessed with craft","IS the target user"],
    gaps:[{g:"No formal PM title",s:"MEDIUM"},{g:"Consumer distribution at scale",s:"MEDIUM"},{g:"Research-to-product translation",s:"LOW"},{g:"SF/NYC location",s:"VARIES"}],
    verdict:"They want a founder. You are one. Top priority." },
  { id:"anthropic-claude-code-pm", company:"Anthropic", title:"PM, Claude Code", comp:"$285K–$305K", fit:"88%", priority:2, status:"prep", loc:"SF / Seattle", tags:["PM","Dev Tools","Ecosystem","Technical"], brief:"anthropic-claude-code-pm-brief.jsx", color:"#f59e0b",
    strengths:["Power user of Claude Code","5+ yrs PM + eng combined","Hacker spirit","Built skills & MCP workflows","Understands ecosystem deeply"],
    gaps:[{g:"No formal PM title",s:"MEDIUM"},{g:"Dev tools PM experience",s:"MEDIUM"},{g:"Distribution track record",s:"MEDIUM"},{g:"SF/Seattle location",s:"VARIES"}],
    verdict:"You use this product daily. Strong technical fit. Lower comp than Consumer PM." },
  { id:"anthropic-people-products", company:"Anthropic", title:"EM, People Products", comp:"$320K–$405K", fit:"92%", priority:3, status:"prep", loc:"Remote + Travel", tags:["EM","People Tools","AI-native","Internal"], brief:"anthropic-em-people-products-brief.jsx", color:"#10b981",
    strengths:["Direct EM experience match","Ships LLM-native features","Self-sufficient builder","IS the customer","Cross-functional thinker","Remote-friendly"],
    gaps:[{g:"HR tech platforms (Greenhouse/Workday)",s:"LOW"},{g:"MCP production experience",s:"MEDIUM"},{g:"Eval design for LLM outputs",s:"MEDIUM"},{g:"Startup speed narrative",s:"MEDIUM"}],
    verdict:"Near-perfect EM fit. Your current job + AI twist. Remote." },
  { id:"nvidia-dht-tpm", company:"NVIDIA", title:"TPM, Digital Human Tech", comp:"$200K–$322K", fit:"78%", priority:4, status:"research", loc:"Remote (CA) +4", tags:["TPM","Digital Humans","3D/Animation","GenAI"], brief:"nvidia-dht-tpm-brief.jsx", color:"#3b82f6",
    strengths:["XR→Digital Humans connection","Cross-team coordination DNA","8+ yrs program mgmt","GenAI practitioner","Communication skills","Remote"],
    gaps:[{g:"No TPM title on resume",s:"LOW"},{g:"Open-source model release exp",s:"MEDIUM"},{g:"3D/animation domain depth",s:"MEDIUM"},{g:"Jira proficiency",s:"LOW"}],
    verdict:"Sleeper pick. XR background connects. Remote-friendly." },
  { id:"nvidia-av-planning", company:"NVIDIA", title:"Sr. Dir, AV Planning & Controls", comp:"$240K–$379.5K", fit:"55%", priority:5, status:"research", loc:"Santa Clara, CA", tags:["PM/PgM","AV","Planning & Controls","Leadership"], brief:"nvidia-av-plan.jsx", color:"#f59e0b",
    strengths:["EM → PM leadership skills","Spatial computing adjacency","AI-native thinking","Cross-team coordination","Builder mentality"],
    gaps:[{g:"No AV/robotics domain experience",s:"HIGH"},{g:"Planning & controls terminology",s:"HIGH"},{g:"NVIDIA DRIVE stack knowledge",s:"HIGH"},{g:"12+ yrs PM/PgM framing",s:"MEDIUM"}],
    verdict:"Compelling domain but significant stretch. Medium priority." },
  { id:"anthropic-ui-engineer", company:"Anthropic", title:"UI Software Engineer", comp:"$320K–$405K", fit:"70%", priority:6, status:"research", loc:"SF / NYC / Seattle", tags:["IC","Frontend","React/Next.js","Consumer"], brief:"anthropic-ui-engineer-brief.jsx", color:"#8b5cf6",
    strengths:["Product instincts","AI-native thinking","IS the target user","Shipping discipline"],
    gaps:[{g:"5+ yrs hands-on frontend (recent)",s:"HIGH"},{g:"Recent IC shipping velocity",s:"MEDIUM"},{g:"Performance optimization depth",s:"MEDIUM"},{g:"Accessibility expertise",s:"MEDIUM"}],
    verdict:"Strong if you want EM→IC. Need to prove recent hands-on coding." },
  { id:"nvidia-av-testing", company:"NVIDIA", title:"Sr. EM, L3/L4 AV Testing", comp:"$272K–$431.25K", fit:"25%", priority:7, status:"watching", loc:"Santa Clara +1", tags:["EM","AV Testing","Simulation","Infrastructure"], brief:"nvidia-av-testing-brief.jsx", color:"#ef4444",
    strengths:["Strong EM skills","Complex systems experience","AI-native thinking","Cross-team collaboration"],
    gaps:[{g:"No ADAS/AV/Simulation experience",s:"HIGH"},{g:"Python/C++ depth",s:"HIGH"},{g:"10+ yrs test infrastructure",s:"HIGH"},{g:"AV simulation frameworks",s:"MEDIUM"}],
    verdict:"Large stretch. 60-day+ prep needed. Lowest priority." },
];

const PROJECTS = [
  { id:"p1", name:"Streaming Chat Clone", role:"anthropic-ui-engineer", status:"not-started", desc:"Next.js + Anthropic SDK streaming chat interface", priority:"high" },
  { id:"p2", name:"Claude Code Skill (published)", role:"anthropic-claude-code-pm", status:"not-started", desc:"Build and publish a useful skill to GitHub", priority:"high" },
  { id:"p3", name:"MCP Server", role:"anthropic-claude-code-pm", status:"not-started", desc:"MCP server connecting Claude to useful data source", priority:"high" },
  { id:"p4", name:"AI Hiring Assistant Prototype", role:"anthropic-people-products", status:"not-started", desc:"Job desc → interview questions + scorecard using Claude API", priority:"high" },
  { id:"p5", name:"3 Consumer Product Briefs", role:"anthropic-consumer-pm", status:"not-started", desc:"Product concepts for claude.ai with user problem, solution, validation plan", priority:"high" },
  { id:"p6", name:"Consumer Product MVP", role:"anthropic-consumer-pm", status:"not-started", desc:"Prototype your best product concept with Claude Code", priority:"high" },
  { id:"p7", name:"Competitive Analysis Doc", role:"anthropic-consumer-pm", status:"not-started", desc:"ChatGPT vs Gemini vs Copilot vs Claude feature comparison", priority:"medium" },
  { id:"p8", name:"Ecosystem Growth Strategy", role:"anthropic-claude-code-pm", status:"not-started", desc:"How to grow Claude Code skills from 1,234 to 10,000", priority:"medium" },
  { id:"p9", name:"Consumer Growth Strategy", role:"anthropic-consumer-pm", status:"not-started", desc:"Strategy to 5x Claude consumer market share in 12 months", priority:"medium" },
  { id:"p10", name:"90-Day Plan (People Products)", role:"anthropic-people-products", status:"not-started", desc:"What you'd do in your first 90 days as EM", priority:"medium" },
];

const LEARNING = [
  { id:"l1", topic:"Anthropic Product Philosophy", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products"], status:"not-started", hours:4, desc:"Cat Wu's posts, side quests, Labs announcement, product culture" },
  { id:"l2", topic:"Claude Code Deep Dive", roles:["anthropic-claude-code-pm","anthropic-ui-engineer"], status:"not-started", hours:6, desc:"Full docs, skills repo, plugin architecture, MCP protocol" },
  { id:"l3", topic:"Consumer AI Competitive Landscape", roles:["anthropic-consumer-pm"], status:"not-started", hours:6, desc:"Use ChatGPT, Gemini, Copilot, Perplexity for a full day each" },
  { id:"l4", topic:"Success Metrics Frameworks", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", hours:4, desc:"HEART, AARRR, North Star metric — practice on Claude features" },
  { id:"l5", topic:"Anthropic Research (PM Level)", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", hours:4, desc:"Constitutional AI, scaling laws, extended thinking — what they mean for products" },
  { id:"l6", topic:"Anthropic Interview Process", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products","anthropic-ui-engineer"], status:"in-progress", hours:4, desc:"Interview format, culture fit, mission alignment, coding rounds" },
  { id:"l7", topic:"Greenhouse API & HR Tech", roles:["anthropic-people-products"], status:"not-started", hours:4, desc:"Harvest API, candidate data models, onboarding workflows" },
  { id:"l8", topic:"NVIDIA ACE & Digital Humans", roles:["nvidia-dht-tpm"], status:"not-started", hours:6, desc:"Audio2Face, Riva, ACE architecture, partner ecosystem" },
  { id:"l9", topic:"AV Simulation Fundamentals", roles:["nvidia-av-planning","nvidia-av-testing"], status:"not-started", hours:10, desc:"Closed-loop sim, AlpaSim, DRIVE Sim, sensor simulation" },
  { id:"l10", topic:"Mock Interview Practice", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products"], status:"not-started", hours:8, desc:"Product sense, metrics, strategy, behavioral — 3 full mock loops" },
];

const STATUS_COLORS = {"not-started":"#4b5563","in-progress":"#f59e0b","complete":"#10b981","applied":"#3b82f6","interviewing":"#8b5cf6","watching":"#6b7280"};
const STATUS_LABELS = {"not-started":"Not Started","in-progress":"In Progress","complete":"Complete","applied":"Applied","interviewing":"Interviewing","watching":"Watching","prep":"Prepping","research":"Researching"};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const Tab = ({active,label,onClick,count}) => (
  <button onClick={onClick} className={`px-4 py-2 text-sm font-mono transition-all border-b-2 ${active ? "text-white border-amber-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
    {label}{count !== undefined && <span className="ml-1.5 text-xs opacity-60">({count})</span>}
  </button>
);

const Pill = ({color,children}) => (
  <span className="text-xs px-2 py-0.5 rounded-full font-mono border" style={{background:`${color}15`,color:color,borderColor:`${color}30`}}>{children}</span>
);

const ProgressBar = ({pct,color="#10b981"}) => (
  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
    <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:color}}/>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════

const Overview = ({roles,projects,learning}) => {
  const applied = roles.filter(r=>r.status==="applied").length;
  const prepping = roles.filter(r=>r.status==="prep").length;
  const projectsDone = projects.filter(p=>p.status==="complete").length;
  const learningDone = learning.filter(l=>l.status==="complete").length;
  const totalHours = learning.reduce((a,l)=>a+l.hours,0);
  const doneHours = learning.filter(l=>l.status==="complete").reduce((a,l)=>a+l.hours,0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["ROLES TRACKED", roles.length, "#f59e0b"],
          ["PREPPING", prepping, "#10b981"],
          ["PROJECTS", `${projectsDone}/${projects.length}`, "#3b82f6"],
          ["LEARNING", `${doneHours}/${totalHours} hrs`, "#8b5cf6"],
        ].map(([label,val,color])=>(
          <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-xs tracking-widest font-mono mb-1" style={{color}}>{label}</div>
            <div className="text-2xl font-light text-white">{val}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-xs tracking-widest text-amber-400 font-mono mb-3">PRIORITY STACK</div>
        <div className="space-y-2">
          {roles.sort((a,b)=>a.priority-b.priority).map((r,i)=>(
            <div key={r.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/8 transition-colors">
              <span className="text-gray-600 font-mono text-xs w-6">#{r.priority}</span>
              <div className="w-2 h-2 rounded-full" style={{background:r.color}}/>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{r.company} · {r.title}</div>
                <div className="text-gray-500 text-xs">{r.comp} · {r.loc}</div>
              </div>
              <Pill color={r.fit==="95%"||r.fit==="92%"||r.fit==="88%"?"#10b981":r.fit==="78%"||r.fit==="70%"?"#f59e0b":"#ef4444"}>{r.fit} fit</Pill>
              <Pill color={STATUS_COLORS[r.status]||"#4b5563"}>{STATUS_LABELS[r.status]}</Pill>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs tracking-widest text-emerald-400 font-mono mb-3">HIGH-PRIORITY PROJECTS</div>
        <div className="space-y-2">
          {projects.filter(p=>p.priority==="high").map(p=>(
            <div key={p.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="w-3 h-3 rounded border" style={{borderColor:STATUS_COLORS[p.status],background:p.status==="complete"?STATUS_COLORS[p.status]:"transparent"}}/>
              <div className="flex-1">
                <div className="text-white text-sm">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.desc}</div>
              </div>
              <Pill color={STATUS_COLORS[p.status]}>{STATUS_LABELS[p.status]}</Pill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RolesView = ({roles}) => {
  const [selected, setSelected] = useState(null);
  const role = selected ? roles.find(r=>r.id===selected) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-2">
        {roles.sort((a,b)=>a.priority-b.priority).map(r=>(
          <button key={r.id} onClick={()=>setSelected(r.id)} className={`w-full text-left p-3 rounded-lg border transition-all ${selected===r.id?"bg-white/10 border-amber-500/40":"bg-white/5 border-white/10 hover:bg-white/8"}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{background:r.color}}/>
              <span className="text-white text-sm font-medium">{r.company}</span>
              <span className="text-gray-500 text-xs ml-auto">#{r.priority}</span>
            </div>
            <div className="text-gray-400 text-xs truncate">{r.title}</div>
          </button>
        ))}
      </div>
      <div className="md:col-span-2">
        {role ? (
          <div className="bg-white/5 border border-white/10 rounded-lg p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{background:role.color}}/>
                <h3 className="text-white text-lg font-medium">{role.company} · {role.title}</h3>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Pill color="#f59e0b">{role.comp}</Pill>
                <Pill color="#3b82f6">{role.loc}</Pill>
                <Pill color={role.fit==="95%"||role.fit==="92%"||role.fit==="88%"?"#10b981":"#f59e0b"}>{role.fit} fit</Pill>
                {role.tags.map(t=><Pill key={t} color="#6b7280">{t}</Pill>)}
              </div>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3">
              <div className="text-xs tracking-widest text-emerald-400 font-mono mb-1">VERDICT</div>
              <div className="text-emerald-200 text-sm">{role.verdict}</div>
            </div>
            <div>
              <div className="text-xs tracking-widest text-emerald-400 font-mono mb-2">STRENGTHS</div>
              {role.strengths.map((s,i)=><div key={i} className="flex items-start gap-2 mb-1"><span className="text-emerald-400 text-xs mt-0.5">✓</span><span className="text-gray-300 text-sm">{s}</span></div>)}
            </div>
            <div>
              <div className="text-xs tracking-widest text-red-400 font-mono mb-2">GAPS</div>
              {role.gaps.map((g,i)=><div key={i} className="flex items-center gap-2 mb-1"><Pill color={g.s==="HIGH"?"#ef4444":g.s==="MEDIUM"?"#f59e0b":"#10b981"}>{g.s}</Pill><span className="text-gray-300 text-sm">{g.g}</span></div>)}
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-gray-500 font-mono">Brief: {role.brief}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-600 text-sm">Select a role to view details</div>
        )}
      </div>
    </div>
  );
};

const CompareView = ({roles}) => {
  const top = roles.filter(r=>r.priority<=4).sort((a,b)=>a.priority-b.priority);
  const fields = [
    {label:"Company",fn:r=>r.company},
    {label:"Role",fn:r=>r.title},
    {label:"Comp",fn:r=>r.comp},
    {label:"Fit",fn:r=>r.fit},
    {label:"Location",fn:r=>r.loc},
    {label:"Status",fn:r=>STATUS_LABELS[r.status]},
    {label:"# Strengths",fn:r=>r.strengths.length},
    {label:"# Gaps",fn:r=>r.gaps.length},
    {label:"High Gaps",fn:r=>r.gaps.filter(g=>g.s==="HIGH").length},
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-white/10">
          <th className="text-left py-2 px-3 text-xs font-mono text-amber-400 tracking-widest">METRIC</th>
          {top.map(r=><th key={r.id} className="text-left py-2 px-3"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{background:r.color}}/><span className="text-white font-mono text-xs">#{r.priority}</span></div></th>)}
        </tr></thead>
        <tbody>
          {fields.map((f,i)=>(
            <tr key={i} className="border-b border-white/5">
              <td className="py-2 px-3 text-gray-500 font-mono text-xs">{f.label}</td>
              {top.map(r=><td key={r.id} className="py-2 px-3 text-gray-300 text-sm">{f.fn(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProjectsView = ({projects,roles}) => (
  <div className="space-y-3">
    {["high","medium"].map(pri=>(
      <div key={pri}>
        <div className="text-xs tracking-widest font-mono mb-2" style={{color:pri==="high"?"#ef4444":"#f59e0b"}}>{pri.toUpperCase()} PRIORITY</div>
        {projects.filter(p=>p.priority===pri).map(p=>{
          const role = roles.find(r=>r.id===p.role);
          return (
            <div key={p.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 mb-2">
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center" style={{borderColor:STATUS_COLORS[p.status]}}>
                {p.status==="complete"&&<div className="w-2 h-2 rounded-sm" style={{background:STATUS_COLORS[p.status]}}/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.desc}</div>
              </div>
              {role&&<Pill color={role.color}>{role.company}</Pill>}
              <Pill color={STATUS_COLORS[p.status]}>{STATUS_LABELS[p.status]}</Pill>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const LearningView = ({learning,roles}) => {
  const total = learning.reduce((a,l)=>a+l.hours,0);
  const done = learning.filter(l=>l.status==="complete").reduce((a,l)=>a+l.hours,0);
  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-sm">Overall Progress</span>
          <span className="text-white font-mono text-sm">{done}/{total} hrs ({Math.round(done/total*100)||0}%)</span>
        </div>
        <ProgressBar pct={Math.round(done/total*100)||0} color="#8b5cf6"/>
      </div>
      <div className="space-y-2">
        {learning.map(l=>(
          <div key={l.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-white text-sm font-medium">{l.topic}</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs font-mono">{l.hours} hrs</span>
                <Pill color={STATUS_COLORS[l.status]}>{STATUS_LABELS[l.status]}</Pill>
              </div>
            </div>
            <div className="text-gray-500 text-xs mb-2">{l.desc}</div>
            <div className="flex gap-1 flex-wrap">
              {l.roles.map(rid=>{const r=roles.find(x=>x.id===rid);return r?<Pill key={rid} color={r.color}>{r.company}</Pill>:null;})}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════

export default function Dashboard() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    {id:"overview", label:"Overview"},
    {id:"roles", label:"Roles", count:ROLES.length},
    {id:"compare", label:"Compare"},
    {id:"projects", label:"Projects", count:PROJECTS.length},
    {id:"learning", label:"Learning", count:LEARNING.length},
  ];

  return (
    <div className="min-h-screen text-white" style={{background:"linear-gradient(160deg,#070707 0%,#0d0d0d 50%,#080808 100%)",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');.font-mono{font-family:'JetBrains Mono',monospace}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}`}</style>

      {/* Header */}
      <div className="border-b border-white/8 px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-amber-400 text-sm">◈</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white" style={{letterSpacing:"-0.02em"}}>Job Prep Command Center</h1>
              <p className="text-gray-500 text-xs font-mono">7 roles · 10 projects · 56 hrs learning · powered by job-prep-intel skill</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/8 px-6 sticky top-0 z-10" style={{background:"rgba(7,7,7,0.95)",backdropFilter:"blur(12px)"}}>
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(t=><Tab key={t.id} active={tab===t.id} label={t.label} count={t.count} onClick={()=>setTab(t.id)}/>)}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {tab==="overview" && <Overview roles={ROLES} projects={PROJECTS} learning={LEARNING}/>}
          {tab==="roles" && <RolesView roles={ROLES}/>}
          {tab==="compare" && <CompareView roles={ROLES}/>}
          {tab==="projects" && <ProjectsView projects={PROJECTS} roles={ROLES}/>}
          {tab==="learning" && <LearningView learning={LEARNING} roles={ROLES}/>}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-gray-700 text-xs font-mono">Update status by editing the data arrays at the top of this file</span>
          <span className="text-gray-700 text-xs font-mono">Last updated: Mar 21, 2026</span>
        </div>
      </div>
    </div>
  );
}
