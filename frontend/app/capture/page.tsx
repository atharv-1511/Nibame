"use client";

import { useState, useCallback } from "react";
import {
  Crosshair,
  Link2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Clock,
  Zap,
} from "lucide-react";

interface CaptureResult {
  domain: string;
  category: string;
  category_label: string;
  color: string;
  tags: string[];
  input_url: string;
}

interface SavedItem extends CaptureResult {
  id: string;
  savedAt: string;
  note?: string;
}

// Mock seed items
const SEED_ITEMS: SavedItem[] = [
  {
    id: "s1",
    input_url: "https://github.com/vercel/next.js",
    domain: "github.com",
    category: "development_code",
    category_label: "Development & Code",
    color: "#24292e",
    tags: ["Development & Code"],
    savedAt: "2 min ago",
    note: "Next.js internals — study the router",
  },
  {
    id: "s2",
    input_url: "https://www.youtube.com/watch?v=Kafka101",
    domain: "youtube.com",
    category: "video_streaming",
    category_label: "Video & Streaming",
    color: "#ff0000",
    tags: ["Video & Streaming"],
    savedAt: "1 hr ago",
    note: "Kafka deep dive by ByteByteGo",
  },
  {
    id: "s3",
    input_url: "https://arxiv.org/abs/2307.09288",
    domain: "arxiv.org",
    category: "research_papers",
    category_label: "Research & Papers",
    color: "#b31b1b",
    tags: ["Research & Papers"],
    savedAt: "Yesterday",
    note: "LLaMA 2 paper — read this weekend",
  },
];

function CategoryBadge({ label, color }: { label: string; color: string }) {
  const bg = `${color}18`;
  const border = `${color}40`;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
      }}
    >
      <span
        style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function ItemCard({ item, onRemove }: { item: SavedItem; onRemove: (id: string) => void }) {
  return (
    <article
      className="glass-card animate-fade-in"
      style={{
        display: "flex",
        gap: "var(--space-4)",
        alignItems: "flex-start",
        borderLeft: `3px solid ${item.color}`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-sm)",
          background: `${item.color}18`,
          border: `1px solid ${item.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <Link2 size={16} color={item.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)" }}>
          <a
            href={item.input_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "300px",
              display: "block",
            }}
          >
            {item.domain}
          </a>
          <button
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.domain}`}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: "1rem",
              lineHeight: 1,
              transition: "color 150ms",
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#f43f5e")}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "var(--text-muted)")}
          >
            ×
          </button>
        </div>

        {item.note && (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "var(--space-3)", lineHeight: 1.5 }}>
            {item.note}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <CategoryBadge label={item.category_label} color={item.color} />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            <Clock size={11} aria-hidden="true" />
            {item.savedAt}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function CapturePage() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState<SavedItem[]>(SEED_ITEMS);
  const [justSaved, setJustSaved] = useState(false);

  const handleCapture = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) { setError("Paste a URL to capture."); return; }

      setIsLoading(true);
      setError("");
      setResult(null);
      setJustSaved(false);

      try {
        const res = await fetch("/api/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = (await res.json()) as CaptureResult;
        setResult(data);
      } catch {
        setError("Could not categorize URL. Please check the format.");
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  const handleSave = useCallback(() => {
    if (!result) return;
    const newItem: SavedItem = {
      ...result,
      id: Date.now().toString(),
      savedAt: "just now",
      note: note.trim() || undefined,
    };
    setItems((prev) => [newItem, ...prev]);
    setJustSaved(true);
    setTimeout(() => {
      setUrl("");
      setNote("");
      setResult(null);
      setJustSaved(false);
    }, 1800);
  }, [result, note]);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="glow-orb glow-orb-violet" aria-hidden="true" />

      <div className="page-header">
        <div className="container-narrow">
          <div className="section-label">capture</div>
          <h1 className="animate-fade-in-up" style={{ marginBottom: "var(--space-3)" }}>
            Universal <span className="gradient-text">Inbox</span>
          </h1>
          <p className="animate-fade-in-up stagger-1" style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
            Drop anything — URLs, links, resources — and nibame will classify, tag, and connect it
            automatically. Never decide where something belongs before saving it.
          </p>

          {/* ── Capture Form ── */}
          <form
            onSubmit={handleCapture}
            id="capture-form"
            className="glass-card-elevated animate-fade-in-up stagger-2"
            style={{ padding: "var(--space-8)", marginBottom: "var(--space-6)" }}
          >
            <label
              htmlFor="capture-url-input"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                marginBottom: "var(--space-2)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              URL or Link
            </label>

            <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "var(--space-4)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                >
                  <Link2 size={16} />
                </span>
                <input
                  id="capture-url-input"
                  className="input"
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/vercel/next.js"
                  disabled={isLoading}
                  autoFocus
                  style={{ paddingLeft: "2.75rem" }}
                  aria-describedby={error ? "capture-error" : undefined}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !url.trim()}
                id="capture-submit-btn"
                style={{ flexShrink: 0 }}
              >
                {isLoading ? (
                  <><span className="spinner" aria-hidden="true" /> Analyzing…</>
                ) : (
                  <><Zap size={15} aria-hidden="true" /> Capture</>
                )}
              </button>
            </div>

            <input
              id="capture-note-input"
              className="input"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional) — why are you saving this?"
              style={{ fontSize: "0.875rem" }}
            />

            {error && (
              <div id="capture-error" className="alert alert-error" style={{ marginTop: "var(--space-4)" }} role="alert">
                <AlertCircle size={15} aria-hidden="true" />
                {error}
              </div>
            )}
          </form>

          {/* ── Result ── */}
          {result && !justSaved && (
            <div
              className="glass-card animate-fade-in"
              style={{
                borderColor: `${result.color}40`,
                borderLeft: `3px solid ${result.color}`,
                marginBottom: "var(--space-6)",
                padding: "var(--space-6)",
              }}
              role="status"
              aria-label={`Categorized as ${result.category_label}`}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                    <Tag size={14} color={result.color} aria-hidden="true" />
                    <CategoryBadge label={result.category_label} color={result.color} />
                  </div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
                    {result.domain}
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    {result.input_url.length > 60 ? result.input_url.slice(0, 60) + "…" : result.input_url}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "var(--space-3)" }}>
                  <button
                    id="capture-save-btn"
                    className="btn btn-primary"
                    onClick={handleSave}
                    type="button"
                  >
                    <CheckCircle2 size={15} aria-hidden="true" /> Save to brain
                  </button>
                  <button
                    id="capture-reset-btn"
                    className="btn btn-ghost"
                    onClick={() => { setResult(null); setUrl(""); setNote(""); }}
                    type="button"
                    aria-label="Discard and capture another"
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {justSaved && (
            <div className="alert alert-success animate-fade-in" style={{ marginBottom: "var(--space-6)" }} role="status">
              <CheckCircle2 size={15} aria-hidden="true" />
              Saved to your brain! Connections are being built…
            </div>
          )}

          {/* ── Saved Items Feed ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
              <h2 style={{ fontSize: "1.125rem", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                <Crosshair size={16} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} aria-hidden="true" />
                Recent captures
              </h2>
              <span className="badge badge-violet">{items.length} items</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {items.map((item) => (
                <ItemCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
