"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MessageSquare, Send, Clock, Sparkles, ChevronDown } from "lucide-react";

/* ── Mock AI response engine ── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ label: string; url: string; category: string; color: string }>;
  timestamp: string;
}

const EXAMPLE_QUERIES = [
  "What did I save about Kafka?",
  "Who do I know in Bangalore?",
  "Show me all my ML resources",
  "What are my active projects?",
  "What videos have I saved this week?",
  "Who works at a startup I should reconnect with?",
];

const MOCK_RESPONSES: Record<string, { content: string; sources?: Message["sources"] }> = {
  kafka: {
    content: `Found **3 Kafka-related items** in your memory graph:\n\n→ **Apache Kafka deep-dive playlist** (YouTube, saved 2 days ago) — ByteByteGo series on partitions, consumer groups, and exactly-once semantics.\n\n→ **Backend Refactor Q4** (Project) — Kafka is listed as a planned component for the event-driven migration.\n\n→ **Aryan K.** in your network is tagged as a Kafka expert. Last contacted 3 weeks ago.\n\n**Nibame noticed:** You've saved 3 Kafka resources but haven't created a learning task yet. Want me to set one up?`,
    sources: [
      { label: "Kafka YT Playlist", url: "https://youtube.com", category: "video_streaming", color: "#ff0000" },
      { label: "Backend Refactor Q4", url: "#", category: "project", color: "#10b981" },
      { label: "Aryan K. — profile", url: "#", category: "person", color: "#f59e0b" },
    ],
  },
  bangalore: {
    content: `Found **2 people** in your network based in Bangalore:\n\n→ **Harsh Mehta** — nibame creator, full-stack engineer. Last interaction: 1 week ago via Discord.\n\n→ **Priya S.** — ML Engineer at an early-stage startup. You connected on LinkedIn 2 months ago. Has expertise in LLMs and vector databases.\n\n**Nibame noticed:** You're planning a trip to Bangalore next quarter (from your travel saves). Want me to surface their contact info for a meetup?`,
    sources: [
      { label: "Harsh Mehta", url: "#", category: "person", color: "#f59e0b" },
      { label: "Priya S.", url: "#", category: "person", color: "#f59e0b" },
    ],
  },
  ml: {
    content: `Found **4 ML / AI resources** in your memory graph:\n\n→ **LLaMA 2 paper** (arXiv:2307.09288) — Meta AI research on open foundation models. Saved 3 days ago.\n\n→ **Priya S.** — ML Engineer in your network. Works on LLMs.\n\n→ **Machine Learning** topic node has 4 connected resources.\n\n→ **Hugging Face** bookmarks — 2 model cards saved.\n\n**Trending in your graph:** You've engaged with LLM content 8× this month. No learning goal created yet.`,
    sources: [
      { label: "LLaMA 2 (arXiv)", url: "https://arxiv.org/abs/2307.09288", category: "research_papers", color: "#b31b1b" },
      { label: "Hugging Face bookmarks", url: "https://huggingface.co", category: "ai_ml", color: "#ffbd00" },
    ],
  },
  projects: {
    content: `You have **2 active projects** in nibame:\n\n→ **nibame prototype** — Status: In progress. 3 contributors tracked (Harsh, Aryan, you). Stack: Next.js, FastAPI, Neo4j. Related resources: 6.\n\n→ **Backend Refactor Q4** — Status: Planning. Kafka migration planned. 1 related person (Aryan). Related resources: 2.\n\n**Nibame noticed:** nibame prototype has the most connected subgraph in your memory. This is likely your highest-priority project right now.`,
    sources: [
      { label: "nibame prototype", url: "#", category: "project", color: "#10b981" },
      { label: "Backend Refactor Q4", url: "#", category: "project", color: "#10b981" },
    ],
  },
  videos: {
    content: `You saved **2 videos** this week:\n\n→ **Apache Kafka deep-dive** (YouTube, 2 days ago) — ByteByteGo. Connected to: Kafka topic, Backend Refactor project.\n\n→ **Next.js 15 App Router walkthrough** (YouTube, 5 days ago) — Fireship. Connected to: nibame prototype, React topic.\n\n**Total videos in library:** 12 · Oldest unseen: 6 weeks ago.`,
    sources: [
      { label: "Kafka deep-dive (YT)", url: "https://youtube.com", category: "video_streaming", color: "#ff0000" },
      { label: "Next.js 15 (YT)", url: "https://youtube.com", category: "video_streaming", color: "#ff0000" },
    ],
  },
};

function getResponse(query: string): { content: string; sources?: Message["sources"] } {
  const q = query.toLowerCase();
  if (q.includes("kafka") || q.includes("distributed")) return MOCK_RESPONSES.kafka;
  if (q.includes("bangalore") || q.includes("know") || q.includes("people") || q.includes("network")) return MOCK_RESPONSES.bangalore;
  if (q.includes("ml") || q.includes("machine learning") || q.includes("ai") || q.includes("llm")) return MOCK_RESPONSES.ml;
  if (q.includes("project") || q.includes("active") || q.includes("work")) return MOCK_RESPONSES.projects;
  if (q.includes("video") || q.includes("youtube") || q.includes("watch")) return MOCK_RESPONSES.videos;

  return {
    content: `I searched your memory graph for **"${query}"** but didn't find a strong match yet.\n\nYour graph currently has:\n→ 15 nodes across 6 entity types\n→ 20 active connections\n→ 2 active projects\n\nTry asking about "Kafka", "Bangalore", "ML resources", or "active projects" — those have the most context right now.`,
  };
}

function formatContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: "var(--space-2)",
        animation: "fadeInUp 0.4s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", opacity: 0.6 }}>
        {!isUser && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-violet-light)" }}>
            🧠 nibame
          </span>
        )}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
          <Clock size={10} style={{ display: "inline", marginRight: 4 }} aria-hidden="true" />
          {msg.timestamp}
        </span>
        {isUser && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-cyan-light)" }}>
            you
          </span>
        )}
      </div>

      <div
        style={{
          maxWidth: "85%",
          padding: "var(--space-4) var(--space-5)",
          borderRadius: isUser
            ? "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)"
            : "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
          background: isUser
            ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))"
            : "var(--bg-card)",
          border: isUser
            ? "1px solid rgba(124,58,237,0.4)"
            : "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            fontFamily: isUser ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: "0.9375rem",
            color: "var(--text-primary)",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {isUser ? msg.content : formatContent(msg.content)}
        </p>

        {msg.sources && msg.sources.length > 0 && (
          <div style={{ marginTop: "var(--space-4)", display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {msg.sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  background: `${s.color}15`,
                  border: `1px solid ${s.color}35`,
                  color: s.color,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 150ms",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} aria-hidden="true" />
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-start" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-violet-light)", opacity: 0.6 }}>
        🧠 nibame
      </span>
      <div
        style={{
          padding: "var(--space-4) var(--space-5)",
          borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <span className="spinner" aria-hidden="true" style={{ borderTopColor: "var(--accent-violet-light)", borderColor: "var(--accent-violet-dim)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          Searching memory graph…
        </span>
      </div>
    </div>
  );
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm nibame — your second brain. Ask me anything about what you've captured.\n\nTry: **\"What did I save about Kafka?\"** or **\"Who do I know in Bangalore?\"**",
      timestamp: "now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = useCallback(async (query?: string) => {
    const q = (query ?? input).trim();
    if (!q || isThinking) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: q, timestamp: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    // Simulate LLM latency
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const response = getResponse(q);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      sources: response.sources,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setIsThinking(false);
    setMessages((prev) => [...prev, aiMsg]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [input, isThinking]);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); }
  }, [handleSend]);

  return (
    <div className="page-wrapper" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="glow-orb" style={{ width: 500, height: 500, top: -200, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }} aria-hidden="true" />

      {/* Page header */}
      <div
        style={{
          paddingTop: 64,
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(5,5,8,0.7)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container-narrow" style={{ padding: "var(--space-5) var(--space-6)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="section-label" style={{ marginBottom: 4 }}>ask</div>
              <h1 style={{ fontFamily: "var(--font-mono)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Ask your <span className="gradient-text">brain</span>
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span className="status-dot" aria-hidden="true" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-green)" }}>
                Graph connected · {messages.length - 1} queries
              </span>
            </div>
          </div>

          {/* Example chips */}
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-3)" }}>
            <ChevronDown size={13} color="var(--text-muted)" style={{ marginTop: 5, flexShrink: 0 }} aria-hidden="true" />
            {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => void handleSend(q)}
                disabled={isThinking}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.75rem" }}
              >
                <Sparkles size={10} aria-hidden="true" />
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "var(--space-8) var(--space-6)",
          position: "relative",
          zIndex: 1,
        }}
        role="log"
        aria-live="polite"
        aria-label="Conversation with nibame"
      >
        <div className="container-narrow" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isThinking && <ThinkingBubble />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(5,5,8,0.85)",
          backdropFilter: "blur(20px)",
          padding: "var(--space-5) var(--space-6)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="container-narrow">
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span
                style={{
                  position: "absolute",
                  left: "var(--space-4)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent-green)",
                  fontSize: "0.875rem",
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                $
              </span>
              <input
                ref={inputRef}
                id="ask-input"
                className="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your captured knowledge…"
                disabled={isThinking}
                autoFocus
                style={{
                  paddingLeft: "2.25rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9375rem",
                  paddingTop: "var(--space-4)",
                  paddingBottom: "var(--space-4)",
                  borderColor: "rgba(16,185,129,0.3)",
                }}
                aria-label="Ask nibame a question"
              />
            </div>
            <button
              id="ask-send-btn"
              className="btn btn-primary"
              onClick={() => void handleSend()}
              disabled={isThinking || !input.trim()}
              aria-label="Send message"
              style={{ flexShrink: 0 }}
            >
              {isThinking ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <Send size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "var(--space-2)", textAlign: "center" }}>
            <MessageSquare size={10} style={{ display: "inline", marginRight: 4 }} aria-hidden="true" />
            nibame searches your memory graph · responses are illustrative prototype data · Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
