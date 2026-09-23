"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Crosshair,
  Globe,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Code2,
  Network,
} from "lucide-react";

/* ── Animated counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(start);
          if (start >= target) clearInterval(timer);
        }, 16);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Typewriter ── */
function Typewriter({ phrases }: { phrases: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 60);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases]);

  return (
    <span>
      {displayed}
      <span className="terminal-cursor" aria-hidden="true" />
    </span>
  );
}

/* ── Feature card ── */
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
  delay: number;
}
function FeatureCard({ icon: Icon, title, desc, accent, delay }: FeatureCardProps) {
  return (
    <article
      className="glass-card animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: `${accent}20`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--space-4)",
          color: accent,
        }}
        aria-hidden="true"
      >
        <Icon size={20} />
      </div>
      <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-2)", color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{desc}</p>
    </article>
  );
}

/* ── Action card ── */
interface ActionCardProps {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  shortcut: string;
  gradient: string;
  delay: number;
}
function ActionCard({ href, icon: Icon, label, desc, shortcut, gradient, delay }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        display: "block",
        background: "var(--bg-card)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-8)",
        textDecoration: "none",
        transition: "all var(--transition-base)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-violet)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* gradient top edge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: gradient,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-5)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "var(--radius-md)",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
          }}
          aria-hidden="true"
        >
          <Icon size={22} />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            background: "var(--bg-glass)",
            padding: "4px 10px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {shortcut}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "var(--space-2)",
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.6 }}>{desc}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          marginTop: "var(--space-5)",
          color: "var(--accent-violet-light)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          fontWeight: 600,
        }}
      >
        <span>Open</span>
        <ArrowRight size={14} aria-hidden="true" />
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="page-wrapper">
      {/* Background orbs */}
      <div className="glow-orb glow-orb-violet" aria-hidden="true" />
      <div className="glow-orb glow-orb-cyan" aria-hidden="true" />

      {/* ── HERO ── */}
      <section
        className="section"
        style={{ paddingTop: "calc(64px + 5rem)", paddingBottom: "5rem" }}
        aria-labelledby="hero-heading"
      >
        <div className="container text-center">
          {/* Label */}
          <div
            className="animate-fade-in"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "6px 16px",
              borderRadius: "var(--radius-full)",
              background: "var(--accent-violet-dim)",
              border: "1px solid rgba(124,58,237,0.3)",
              marginBottom: "var(--space-6)",
            }}
          >
            <span className="status-dot" aria-hidden="true" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--accent-violet-light)",
                fontWeight: 600,
              }}
            >
              open-source · privacy-first · self-hostable
            </span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="animate-fade-in-up stagger-1"
            style={{ marginBottom: "var(--space-4)", maxWidth: "900px", margin: "0 auto var(--space-4)" }}
          >
            <span className="gradient-text">Your life.</span>
            <br />
            Connected. Searchable.{" "}
            <span className="shimmer-text">
              <Typewriter phrases={["Remembered.", "Understood.", "Connected.", "Yours."]} />
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-in-up stagger-2"
            style={{
              maxWidth: "640px",
              margin: "0 auto var(--space-10)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
            }}
          >
            nibame is a unified context layer for your life — one place that captures everything across
            personal, work, learning, and relationships, and brings the right thing back{" "}
            <em style={{ color: "var(--accent-violet-light)", fontStyle: "normal" }}>when it actually matters.</em>
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up stagger-3"
            style={{
              display: "flex",
              gap: "var(--space-4)",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "var(--space-16)",
            }}
          >
            <Link href="/capture" className="btn btn-primary btn-lg" id="hero-capture-cta">
              <Crosshair size={18} aria-hidden="true" />
              Start Capturing
            </Link>
            <Link href="/explore" className="btn btn-secondary btn-lg" id="hero-explore-cta">
              <Sparkles size={18} aria-hidden="true" />
              Explore the Graph
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up stagger-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "var(--space-4)",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            {[
              { value: 2847, suffix: "", label: "items captured" },
              { value: 12400, suffix: "+", label: "connections made" },
              { value: 94, suffix: "%", label: "retrieval accuracy" },
            ].map(({ value, suffix, label }) => (
              <div
                key={label}
                className="glass-card"
                style={{ padding: "var(--space-5)", textAlign: "center" }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    background: "var(--gradient-brand)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUR CORE ACTIONS ── */}
      <section className="section" aria-labelledby="actions-heading">
        <div className="container">
          <div className="text-center" style={{ marginBottom: "var(--space-12)" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              Four core actions
            </div>
            <h2 id="actions-heading" className="section-title animate-fade-in-up">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="section-desc animate-fade-in-up stagger-1" style={{ margin: "0 auto" }}>
              nibame is deliberately minimal. Four actions, infinite depth. No tabs, no dashboards, no
              notification hell.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            <ActionCard
              href="/capture"
              icon={Crosshair}
              label="Capture"
              desc="Throw anything in — URLs, notes, people, ideas. Zero friction. The system figures out structure afterward."
              shortcut="⌘ K"
              gradient="linear-gradient(135deg, #7c3aed, #a855f7)"
              delay={100}
            />
            <ActionCard
              href="/search"
              icon={Globe}
              label="Search"
              desc="Natural-language retrieval. Ask 'What did I save about Kafka?' and get back connected results instantly."
              shortcut="⌘ /"
              gradient="linear-gradient(135deg, #06b6d4, #0ea5e9)"
              delay={200}
            />
            <ActionCard
              href="/explore"
              icon={Sparkles}
              label="Explore"
              desc="An interactive memory graph. See how your ideas, people, and projects connect in a force-directed universe."
              shortcut="⌘ E"
              gradient="linear-gradient(135deg, #10b981, #059669)"
              delay={300}
            />
            <ActionCard
              href="/ask"
              icon={MessageSquare}
              label="Ask"
              desc="Talk to your brain. 'Who do I know in Bangalore?' or 'What Kafka resources have I saved?' — answered instantly."
              shortcut="⌘ ."
              gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* ── PRODUCT PHILOSOPHY ── */}
      <section className="section" aria-labelledby="philosophy-heading">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-16)",
              alignItems: "center",
            }}
          >
            {/* Left: Terminal */}
            <div className="animate-fade-in-up">
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dots" aria-hidden="true">
                    <div className="terminal-dot" />
                    <div className="terminal-dot" />
                    <div className="terminal-dot" />
                  </div>
                  <span className="terminal-title">nibame · memory graph</span>
                </div>
                <div className="terminal-body">
                  <p>
                    <span className="terminal-prompt">$ </span>
                    <span style={{ color: "#e2e8f0" }}>capture</span>{" "}
                    <span style={{ color: "#06b6d4" }}>https://youtube.com/watch?v=x9GDMKr</span>
                  </p>
                  <br />
                  <p style={{ color: "#64748b" }}>{">"} Analyzing URL structure...</p>
                  <p style={{ color: "#64748b" }}>{">"} Detected: Video · Distributed Systems</p>
                  <p style={{ color: "#64748b" }}>{">"} Linking to existing context...</p>
                  <br />
                  <p style={{ color: "#10b981" }}>✓ Captured. 3 connections made:</p>
                  <p style={{ color: "#a78bfa" }}>&nbsp;&nbsp;→ Topic: Apache Kafka</p>
                  <p style={{ color: "#a78bfa" }}>&nbsp;&nbsp;→ Project: Backend Refactor Q4</p>
                  <p style={{ color: "#a78bfa" }}>&nbsp;&nbsp;→ Person: Harsh (sent you this)</p>
                  <br />
                  <p>
                    <span className="terminal-prompt">$ </span>
                    <span className="terminal-cursor" aria-hidden="true" />
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="animate-fade-in-up stagger-2">
              <div className="section-label">The core idea</div>
              <h2 id="philosophy-heading" className="section-title">
                Saving ≠ Remembering
              </h2>
              <p className="section-desc" style={{ marginBottom: "var(--space-6)" }}>
                You save reels, DM yourself links, bookmark things you swear you&apos;ll come back to.
                You never do. When you actually need something, it&apos;s buried across a dozen apps with
                no way to connect any of it.
              </p>
              <p className="section-desc" style={{ marginBottom: "var(--space-8)" }}>
                nibame closes this gap. It doesn&apos;t store files — it builds a{" "}
                <span style={{ color: "var(--accent-violet-light)" }}>knowledge graph</span> of your
                life, where every saved item has relationships to people, projects, topics, and places.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  "Entities + relationships, not folders",
                  "Capture-first: decide structure later",
                  "Natural-language retrieval via graph + semantic search",
                  "Passive intelligence surfaces connections you didn't notice",
                ].map((point) => (
                  <div
                    key={point}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        background: "var(--accent-violet-dim)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                      aria-hidden="true"
                    >
                      <span style={{ color: "var(--accent-violet-light)", fontSize: 10 }}>✓</span>
                    </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" aria-labelledby="features-heading">
        <div className="container">
          <div className="text-center" style={{ marginBottom: "var(--space-12)" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              Built different
            </div>
            <h2 id="features-heading" className="section-title animate-fade-in-up">
              Architecture that respects you
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--space-5)",
            }}
          >
            <FeatureCard
              icon={Lock}
              title="Privacy-first"
              desc="Your data never leaves your machine unless you choose to sync. Self-hostable on your own infrastructure."
              accent="#a78bfa"
              delay={100}
            />
            <FeatureCard
              icon={Brain}
              title="Graph memory"
              desc="Built on a Neo4j-style graph database. Information is stored as entities and relationships, not flat files."
              accent="#06b6d4"
              delay={200}
            />
            <FeatureCard
              icon={Zap}
              title="Zero-friction capture"
              desc="Drop a link, thought, or person in under 3 seconds. Categorization and tagging happen automatically."
              accent="#10b981"
              delay={300}
            />
            <FeatureCard
              icon={Network}
              title="Social graph"
              desc="A private network of people you know — where they work, what you've shared — answerable in natural language."
              accent="#f59e0b"
              delay={400}
            />
            <FeatureCard
              icon={Code2}
              title="Open-source"
              desc="Every line of code is public. Contribute, fork, audit. Built in the open with the community at the center."
              accent="#f43f5e"
              delay={500}
            />
            <FeatureCard
              icon={Globe}
              title="Location intelligence"
              desc="Tie saved content to real-world places. Travel reels resurface when you're planning a trip to that city."
              accent="#7c3aed"
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="section" aria-labelledby="cta-heading">
        <div className="container text-center">
          <div
            className="glass-card-elevated animate-fade-in-up"
            style={{ padding: "var(--space-16) var(--space-8)", maxWidth: 700, margin: "0 auto" }}
          >
            <div className="glow-orb" style={{ width: 300, height: 300, top: -100, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }} aria-hidden="true" />
            <div className="section-label" style={{ justifyContent: "center", position: "relative", zIndex: 1 }}>
              get started
            </div>
            <h2 id="cta-heading" className="section-title" style={{ position: "relative", zIndex: 1, marginBottom: "var(--space-4)" }}>
              Your second brain awaits
            </h2>
            <p className="section-desc" style={{ margin: "0 auto var(--space-8)", position: "relative", zIndex: 1 }}>
              Start capturing anything. nibame will do the rest.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <Link href="/capture" className="btn btn-primary btn-lg" id="footer-cta-capture" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
                <Crosshair size={18} aria-hidden="true" />
                Open Capture
              </Link>
              <a
                href="https://github.com/HarzhMehta/nibame"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
                id="footer-cta-github"
              >
                <Code2 size={18} aria-hidden="true" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "var(--space-8) 0",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          nibame · にばめ · &quot;second&quot; in Japanese · open-source, privacy-first ·{" "}
          <a href="https://discord.gg/jfj7tSQRU5" target="_blank" rel="noopener noreferrer">
            join Discord
          </a>
        </p>
      </footer>
    </div>
  );
}
