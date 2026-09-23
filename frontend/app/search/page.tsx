"use client";

import { useState, useCallback } from "react";
import { Search, Filter, Clock, Tag, Link2, Globe, Video, Code2, BookOpen, Users, Briefcase, Sparkles } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  domain: string;
  url: string;
  category: string;
  categoryLabel: string;
  color: string;
  snippet: string;
  savedAt: string;
  connections: string[];
}

const ALL_RESULTS: SearchResult[] = [
  {
    id: "r1",
    title: "Apache Kafka — Distributed Streaming Deep Dive",
    domain: "youtube.com",
    url: "https://youtube.com/watch?v=kafka101",
    category: "video_streaming",
    categoryLabel: "Video & Streaming",
    color: "#ff0000",
    snippet: "Complete walkthrough of Kafka's internals — partitions, consumer groups, and exactly-once semantics. Saved from ByteByteGo.",
    savedAt: "2 days ago",
    connections: ["Backend Refactor Q4", "Apache Kafka", "System Design"],
  },
  {
    id: "r2",
    title: "vercel/next.js — The React Framework",
    domain: "github.com",
    url: "https://github.com/vercel/next.js",
    category: "development_code",
    categoryLabel: "Development & Code",
    color: "#24292e",
    snippet: "Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching.",
    savedAt: "1 week ago",
    connections: ["nibame frontend", "React", "Vercel"],
  },
  {
    id: "r3",
    title: "LLaMA 2 — Open Foundation and Fine-Tuned Chat Models",
    domain: "arxiv.org",
    url: "https://arxiv.org/abs/2307.09288",
    category: "research_papers",
    categoryLabel: "Research & Papers",
    color: "#b31b1b",
    snippet: "Touvron et al. introduce LLaMA 2, a collection of pretrained and fine-tuned LLMs ranging from 7B to 70B parameters.",
    savedAt: "3 days ago",
    connections: ["AI / ML", "LLMs", "Meta Research"],
  },
  {
    id: "r4",
    title: "Building a Second Brain — Notion Template",
    domain: "notion.so",
    url: "https://notion.so/second-brain",
    category: "cloud_documents",
    categoryLabel: "Cloud Documents",
    color: "#000000",
    snippet: "A Notion workspace template for the Second Brain methodology — PARA method, progressive summarisation, and project tracking.",
    savedAt: "1 month ago",
    connections: ["PKM", "Note-taking", "Productivity"],
  },
  {
    id: "r5",
    title: "Neo4j — Graph Database for Python Developers",
    domain: "dev.to",
    url: "https://dev.to/neo4j/getting-started-python",
    category: "development_code",
    categoryLabel: "Development & Code",
    color: "#3d3d3d",
    snippet: "Getting started with Neo4j in Python — using the official driver, Cypher queries, and building a knowledge graph from scratch.",
    savedAt: "5 days ago",
    connections: ["nibame architecture", "Graph DB", "Python"],
  },
  {
    id: "r6",
    title: "System Design Interview — Volume 2",
    domain: "amazon.com",
    url: "https://amazon.com/System-Design-Interview",
    category: "shopping_commerce",
    categoryLabel: "Shopping",
    color: "#ff9900",
    snippet: "Alex Xu's follow-up to the bestselling System Design Interview guide. Covers distributed systems, rate limiters, and Kafka.",
    savedAt: "2 weeks ago",
    connections: ["System Design", "Books", "Interview Prep"],
  },
];

const FILTERS = [
  { id: "all", label: "All", icon: Globe },
  { id: "video_streaming", label: "Videos", icon: Video },
  { id: "development_code", label: "Code", icon: Code2 },
  { id: "research_papers", label: "Research", icon: BookOpen },
  { id: "professional_network", label: "People", icon: Users },
  { id: "work", label: "Work", icon: Briefcase },
];

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <article
      className="glass-card"
      style={{
        borderLeft: `3px solid ${result.color}`,
        transition: "all var(--transition-base)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = result.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${result.color}20`;
        (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-sm)",
            background: `${result.color}15`,
            border: `1px solid ${result.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Link2 size={18} color={result.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                background: "var(--bg-glass)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {result.domain}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: result.color,
                background: `${result.color}15`,
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                border: `1px solid ${result.color}30`,
              }}
            >
              <Tag size={10} aria-hidden="true" />
              {result.categoryLabel}
            </span>
          </div>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: "none",
              lineHeight: 1.3,
              display: "block",
              marginBottom: "var(--space-2)",
            }}
          >
            {result.title}
          </a>

          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-3)" }}>
            {result.snippet}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <Clock size={11} aria-hidden="true" />
              {result.savedAt}
            </span>
            {result.connections.slice(0, 3).map((c) => (
              <span key={c} className="tag">
                <Sparkles size={10} aria-hidden="true" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setHasSearched(true);
    },
    []
  );

  const filteredResults = ALL_RESULTS.filter((r) => {
    const matchFilter = activeFilter === "all" || r.category === activeFilter;
    const matchQuery =
      !hasSearched ||
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.snippet.toLowerCase().includes(query.toLowerCase()) ||
      r.domain.toLowerCase().includes(query.toLowerCase()) ||
      r.connections.some((c) => c.toLowerCase().includes(query.toLowerCase()));
    return matchFilter && matchQuery;
  });

  return (
    <div className="page-wrapper">
      <div className="glow-orb glow-orb-cyan" aria-hidden="true" style={{ top: -100, right: -100, left: "auto" }} />

      <div className="page-header">
        <div className="container-narrow">
          <div className="section-label">search</div>
          <h1 className="animate-fade-in-up" style={{ marginBottom: "var(--space-3)" }}>
            Ask your <span className="gradient-text">memory</span>
          </h1>
          <p className="animate-fade-in-up stagger-1" style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
            Natural-language retrieval across everything you&apos;ve ever captured. Search by topic, domain, person, or project.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            id="search-form"
            className="animate-fade-in-up stagger-2"
            style={{ marginBottom: "var(--space-6)" }}
          >
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
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
                  <Search size={18} />
                </span>
                <input
                  id="search-input"
                  className="input"
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setHasSearched(false); }}
                  placeholder='Try "Kafka" or "distributed systems" or "people in Bangalore"'
                  style={{ paddingLeft: "2.75rem", fontSize: "1rem", paddingTop: "var(--space-4)", paddingBottom: "var(--space-4)" }}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary" id="search-submit-btn">
                <Search size={16} aria-hidden="true" /> Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div
            className="animate-fade-in-up stagger-3"
            style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-8)" }}
            role="group"
            aria-label="Filter by category"
          >
            <Filter size={14} color="var(--text-muted)" style={{ marginTop: 6 }} aria-hidden="true" />
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                id={`filter-${id}`}
                className="btn btn-sm"
                style={{
                  background: activeFilter === id ? "var(--accent-violet-dim)" : "var(--bg-glass)",
                  color: activeFilter === id ? "var(--accent-violet-light)" : "var(--text-secondary)",
                  border: `1px solid ${activeFilter === id ? "rgba(124,58,237,0.4)" : "var(--border-subtle)"}`,
                }}
                onClick={() => setActiveFilter(id)}
                aria-pressed={activeFilter === id}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* Results header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-5)",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 400 }}>
              {hasSearched && query
                ? `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""} for "${query}"`
                : `${filteredResults.length} captured items`}
            </h2>
          </div>

          {/* Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }} role="list" aria-label="Search results">
            {filteredResults.length > 0 ? (
              filteredResults.map((r) => <ResultCard key={r.id} result={r} />)
            ) : (
              <div
                className="glass-card text-center"
                style={{ padding: "var(--space-12)" }}
              >
                <Search size={40} color="var(--text-muted)" style={{ margin: "0 auto var(--space-4)" }} aria-hidden="true" />
                <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  No results found for &ldquo;{query}&rdquo;. Try a broader search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
