import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";

import Dashboard from "../job-prep-dashboard.jsx";
import RoleDetail from "./RoleDetail.jsx";
import AnthropicConsumerPM from "../briefs/anthropic-consumer-pm-brief.jsx";
import AnthropicClaudeCodePM from "../briefs/anthropic-claude-code-pm-brief.jsx";
import AnthropicPeopleProducts from "../briefs/anthropic-em-people-products-brief.jsx";
import AnthropicUIEngineer from "../briefs/anthropic-ui-engineer-brief.jsx";
import NvidiaAVPlan from "../briefs/nvidia-av-plan.jsx";
import NvidiaAVTesting from "../briefs/nvidia-av-testing-brief.jsx";
import NvidiaDHT from "../briefs/nvidia-dht-tpm-brief.jsx";

// ─── Static Data ──────────────────────────────────────────────
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

const INITIAL_TASKS = [
  { id:"t1", title:"Streaming Chat Clone", type:"project", roles:["anthropic-ui-engineer","anthropic-claude-code-pm","anthropic-consumer-pm"], status:"not-started", desc:"Next.js + Anthropic SDK streaming chat interface", priority:"high" },
  { id:"t2", title:"Claude Code Skill (published)", type:"project", roles:["anthropic-claude-code-pm","anthropic-ui-engineer"], status:"not-started", desc:"Build and publish a useful skill to GitHub", priority:"high" },
  { id:"t3", title:"MCP Server", type:"project", roles:["anthropic-claude-code-pm","anthropic-ui-engineer","anthropic-consumer-pm"], status:"not-started", desc:"MCP server connecting Claude to useful data source", priority:"high" },
  { id:"t4", title:"AI Hiring Assistant Prototype", type:"project", roles:["anthropic-people-products","anthropic-consumer-pm"], status:"not-started", desc:"Job desc → interview questions + scorecard using Claude API", priority:"high" },
  { id:"t5", title:"3 Consumer Product Briefs", type:"project", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", desc:"Product concepts for claude.ai with user problem, solution, validation plan", priority:"high" },
  { id:"t6", title:"Consumer Product MVP", type:"project", roles:["anthropic-consumer-pm","anthropic-ui-engineer"], status:"not-started", desc:"Prototype your best product concept with Claude Code", priority:"high" },
  { id:"t7", title:"Competitive Analysis Doc", type:"project", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", desc:"ChatGPT vs Gemini vs Copilot vs Claude feature comparison", priority:"medium" },
  { id:"t8", title:"Ecosystem Growth Strategy", type:"project", roles:["anthropic-claude-code-pm","anthropic-consumer-pm"], status:"not-started", desc:"How to grow Claude Code skills from 1,234 to 10,000", priority:"medium" },
  { id:"t9", title:"Consumer Growth Strategy", type:"project", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", desc:"Strategy to 5x Claude consumer market share in 12 months", priority:"medium" },
  { id:"t10", title:"90-Day Plan (People Products)", type:"project", roles:["anthropic-people-products"], status:"not-started", desc:"What you'd do in your first 90 days as EM", priority:"medium" },
  { id:"t11", title:"Anthropic Product Philosophy", type:"learning", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products"], status:"not-started", desc:"Cat Wu's posts, side quests, Labs announcement, product culture", priority:"high", hours:4 },
  { id:"t12", title:"Claude Code Deep Dive", type:"learning", roles:["anthropic-claude-code-pm","anthropic-ui-engineer"], status:"not-started", desc:"Full docs, skills repo, plugin architecture, MCP protocol", priority:"high", hours:6 },
  { id:"t13", title:"Consumer AI Competitive Landscape", type:"learning", roles:["anthropic-consumer-pm"], status:"not-started", desc:"Use ChatGPT, Gemini, Copilot, Perplexity for a full day each", priority:"high", hours:6 },
  { id:"t14", title:"Success Metrics Frameworks", type:"learning", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", desc:"HEART, AARRR, North Star metric — practice on Claude features", priority:"medium", hours:4 },
  { id:"t15", title:"Anthropic Research (PM Level)", type:"learning", roles:["anthropic-consumer-pm","anthropic-claude-code-pm"], status:"not-started", desc:"Constitutional AI, scaling laws, extended thinking — what they mean for products", priority:"medium", hours:4 },
  { id:"t16", title:"Anthropic Interview Process", type:"learning", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products","anthropic-ui-engineer"], status:"in-progress", desc:"Interview format, culture fit, mission alignment, coding rounds", priority:"high", hours:4 },
  { id:"t17", title:"Greenhouse API & HR Tech", type:"learning", roles:["anthropic-people-products"], status:"not-started", desc:"Harvest API, candidate data models, onboarding workflows", priority:"medium", hours:4 },
  { id:"t18", title:"NVIDIA ACE & Digital Humans", type:"learning", roles:["nvidia-dht-tpm"], status:"not-started", desc:"Audio2Face, Riva, ACE architecture, partner ecosystem", priority:"medium", hours:6 },
  { id:"t19", title:"AV Simulation Fundamentals", type:"learning", roles:["nvidia-av-planning","nvidia-av-testing"], status:"not-started", desc:"Closed-loop sim, AlpaSim, DRIVE Sim, sensor simulation", priority:"medium", hours:10 },
  { id:"t20", title:"Mock Interview Practice", type:"learning", roles:["anthropic-consumer-pm","anthropic-claude-code-pm","anthropic-people-products"], status:"not-started", desc:"Product sense, metrics, strategy, behavioral — 3 full mock loops", priority:"high", hours:8 },
];

const BRIEF_COMPONENTS = {
  "anthropic-consumer-pm": AnthropicConsumerPM,
  "anthropic-claude-code-pm": AnthropicClaudeCodePM,
  "anthropic-people-products": AnthropicPeopleProducts,
  "anthropic-ui-engineer": AnthropicUIEngineer,
  "nvidia-av-planning": NvidiaAVPlan,
  "nvidia-av-testing": NvidiaAVTesting,
  "nvidia-dht-tpm": NvidiaDHT,
};

const BRIEFS = [
  { path: "anthropic-consumer-pm", label: "Anthropic Consumer PM", component: AnthropicConsumerPM, priority: 1, color: "#10b981" },
  { path: "anthropic-claude-code-pm", label: "Anthropic Claude Code PM", component: AnthropicClaudeCodePM, priority: 2, color: "#f59e0b" },
  { path: "anthropic-people-products", label: "Anthropic EM, People Products", component: AnthropicPeopleProducts, priority: 3, color: "#10b981" },
  { path: "nvidia-dht-tpm", label: "NVIDIA TPM, Digital Humans", component: NvidiaDHT, priority: 4, color: "#3b82f6" },
  { path: "nvidia-av-plan", label: "NVIDIA AV Planning & Controls", component: NvidiaAVPlan, priority: 5, color: "#f59e0b" },
  { path: "anthropic-ui-engineer", label: "Anthropic UI Engineer", component: AnthropicUIEngineer, priority: 6, color: "#8b5cf6" },
  { path: "nvidia-av-testing", label: "NVIDIA AV Testing EM", component: NvidiaAVTesting, priority: 7, color: "#ef4444" },
];

// ─── Nav ──────────────────────────────────────────────────────
function Nav() {
  const location = useLocation();

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50, background: "rgba(7,7,7,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 52, gap: 16 }}>
          <Link to="/" style={{ color: location.pathname === "/" ? "#f59e0b" : "#9ca3af", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>◈</span>
            COMMAND CENTER
          </Link>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", gap: 4, overflowX: "auto", flex: 1, scrollbarWidth: "none" }}>
            {BRIEFS.map((b) => (
              <Link key={b.path} to={`/brief/${b.path}`}
                style={{ color: location.pathname.includes(b.path) ? "#fff" : "#6b7280", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", fontSize: 11, padding: "6px 10px", borderRadius: 6, whiteSpace: "nowrap", background: location.pathname.includes(b.path) ? "rgba(255,255,255,0.1)" : "transparent", transition: "all 0.15s" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: b.color, marginRight: 6 }} />
                #{b.priority}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function BriefWrapper({ Component }) {
  return <div style={{ paddingTop: 52 }}><Component /></div>;
}

// ─── App ──────────────────────────────────────────────────────
function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [notes, setNotes] = useState([]);

  const nextId = useRef(100);
  const genId = (prefix) => `${prefix}${nextId.current++}`;

  const addNote = (roleId, text) => {
    setNotes(prev => [...prev, { id: genId("n"), roleId, text, createdAt: Date.now() }]);
  };

  const addTask = (taskData) => {
    setTasks(prev => [...prev, { ...taskData, id: genId("t") }]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={
          <div style={{ paddingTop: 52 }}>
            <Dashboard roles={ROLES} tasks={tasks} onUpdateTask={updateTask} />
          </div>
        } />
        <Route path="/role/:id" element={
          <div style={{ paddingTop: 52 }}>
            <RoleDetail
              roles={ROLES}
              tasks={tasks}
              notes={notes}
              onAddNote={addNote}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              briefComponents={BRIEF_COMPONENTS}
            />
          </div>
        } />
        {BRIEFS.map((b) => (
          <Route key={b.path} path={`/brief/${b.path}`} element={<BriefWrapper Component={b.component} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
