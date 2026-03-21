import React, { useState, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";

// Import all briefs and dashboard
import Dashboard from "../job-prep-dashboard.jsx";
import AnthropicConsumerPM from "../briefs/anthropic-consumer-pm-brief.jsx";
import AnthropicClaudeCodePM from "../briefs/anthropic-claude-code-pm-brief.jsx";
import AnthropicPeopleProducts from "../briefs/anthropic-em-people-products-brief.jsx";
import AnthropicUIEngineer from "../briefs/anthropic-ui-engineer-brief.jsx";
import NvidiaAVPlan from "../briefs/nvidia-av-plan.jsx";
import NvidiaAVTesting from "../briefs/nvidia-av-testing-brief.jsx";
import NvidiaDHT from "../briefs/nvidia-dht-tpm-brief.jsx";

const BRIEFS = [
  { path: "anthropic-consumer-pm", label: "Anthropic Consumer PM", component: AnthropicConsumerPM, priority: 1, color: "#10b981" },
  { path: "anthropic-claude-code-pm", label: "Anthropic Claude Code PM", component: AnthropicClaudeCodePM, priority: 2, color: "#f59e0b" },
  { path: "anthropic-people-products", label: "Anthropic EM, People Products", component: AnthropicPeopleProducts, priority: 3, color: "#10b981" },
  { path: "nvidia-dht-tpm", label: "NVIDIA TPM, Digital Humans", component: NvidiaDHT, priority: 4, color: "#3b82f6" },
  { path: "nvidia-av-plan", label: "NVIDIA AV Planning & Controls", component: NvidiaAVPlan, priority: 5, color: "#f59e0b" },
  { path: "anthropic-ui-engineer", label: "Anthropic UI Engineer", component: AnthropicUIEngineer, priority: 6, color: "#8b5cf6" },
  { path: "nvidia-av-testing", label: "NVIDIA AV Testing EM", component: NvidiaAVTesting, priority: 7, color: "#ef4444" },
];

function Nav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        background: "rgba(7,7,7,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", height: 52, gap: 16 }}>
          <Link
            to="/"
            style={{
              color: location.pathname === "/" ? "#f59e0b" : "#9ca3af",
              textDecoration: "none",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>◈</span>
            COMMAND CENTER
          </Link>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              flex: 1,
              scrollbarWidth: "none",
            }}
          >
            {BRIEFS.map((b) => (
              <Link
                key={b.path}
                to={`/brief/${b.path}`}
                style={{
                  color: location.pathname.includes(b.path) ? "#fff" : "#6b7280",
                  textDecoration: "none",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 6,
                  whiteSpace: "nowrap",
                  background: location.pathname.includes(b.path) ? "rgba(255,255,255,0.1)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: b.color,
                    marginRight: 6,
                  }}
                />
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
  return (
    <div style={{ paddingTop: 52 }}>
      <Component />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ paddingTop: 52 }}>
              <Dashboard />
            </div>
          }
        />
        {BRIEFS.map((b) => (
          <Route
            key={b.path}
            path={`/brief/${b.path}`}
            element={<BriefWrapper Component={b.component} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
