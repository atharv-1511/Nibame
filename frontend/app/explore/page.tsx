"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Network, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

/* ── Graph Data ── */
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "topic" | "person" | "project" | "resource" | "place" | "hub";
  color: string;
  size: number;
  desc: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  strength: number;
}

const NODES: GraphNode[] = [
  { id: "nibame", label: "nibame", type: "hub", color: "#7c3aed", size: 28, desc: "Your second brain — the central context engine" },
  // Topics
  { id: "kafka", label: "Apache Kafka", type: "topic", color: "#06b6d4", size: 18, desc: "Distributed event streaming platform" },
  { id: "system-design", label: "System Design", type: "topic", color: "#06b6d4", size: 16, desc: "Large-scale system architecture patterns" },
  { id: "ml", label: "Machine Learning", type: "topic", color: "#06b6d4", size: 16, desc: "AI and ML resources" },
  { id: "neo4j", label: "Graph DB", type: "topic", color: "#06b6d4", size: 14, desc: "Neo4j and graph database concepts" },
  { id: "python", label: "Python", type: "topic", color: "#06b6d4", size: 14, desc: "Python programming resources" },
  // People
  { id: "harsh", label: "Harsh Mehta", type: "person", color: "#f59e0b", size: 18, desc: "nibame creator — GitHub: HarzhMehta" },
  { id: "priya", label: "Priya S.", type: "person", color: "#f59e0b", size: 14, desc: "ML Engineer at Bangalore startup" },
  { id: "aryan", label: "Aryan K.", type: "person", color: "#f59e0b", size: 14, desc: "OSS contributor, distributed systems" },
  // Projects
  { id: "proj-nibame", label: "nibame prototype", type: "project", color: "#10b981", size: 16, desc: "Current active project — personal context engine" },
  { id: "proj-refactor", label: "Backend Refactor Q4", type: "project", color: "#10b981", size: 14, desc: "Work project — migrating to event-driven arch" },
  // Resources
  { id: "yt-kafka", label: "Kafka YT playlist", type: "resource", color: "#a78bfa", size: 12, desc: "YouTube playlist on Kafka internals (ByteByteGo)" },
  { id: "arxiv-llama", label: "LLaMA 2 paper", type: "resource", color: "#a78bfa", size: 12, desc: "arXiv:2307.09288 — Meta AI Research" },
  { id: "gh-nextjs", label: "vercel/next.js", type: "resource", color: "#a78bfa", size: 12, desc: "GitHub repo — Next.js React framework" },
  // Places
  { id: "bangalore", label: "Bangalore", type: "place", color: "#f43f5e", size: 14, desc: "Tech hub — 3 people in network here" },
];

const LINKS: GraphLink[] = [
  { source: "nibame", target: "proj-nibame", label: "active_project", strength: 0.9 },
  { source: "nibame", target: "kafka", label: "learning", strength: 0.7 },
  { source: "nibame", target: "ml", label: "interest", strength: 0.6 },
  { source: "nibame", target: "harsh", label: "created_by", strength: 0.8 },
  { source: "kafka", target: "system-design", label: "part_of", strength: 0.8 },
  { source: "kafka", target: "yt-kafka", label: "resource", strength: 0.9 },
  { source: "kafka", target: "proj-refactor", label: "used_in", strength: 0.7 },
  { source: "kafka", target: "aryan", label: "expert", strength: 0.6 },
  { source: "ml", label: "arxiv-llama", target: "arxiv-llama", strength: 0.8 },
  { source: "ml", target: "priya", label: "works_on", strength: 0.7 },
  { source: "neo4j", target: "proj-nibame", label: "used_in", strength: 0.8 },
  { source: "neo4j", target: "system-design", label: "part_of", strength: 0.5 },
  { source: "python", target: "neo4j", label: "driver", strength: 0.7 },
  { source: "harsh", target: "proj-nibame", label: "leads", strength: 0.9 },
  { source: "harsh", target: "bangalore", label: "based_in", strength: 0.7 },
  { source: "priya", target: "bangalore", label: "based_in", strength: 0.7 },
  { source: "aryan", target: "proj-nibame", label: "contributes", strength: 0.6 },
  { source: "proj-nibame", target: "gh-nextjs", label: "built_with", strength: 0.8 },
  { source: "proj-nibame", target: "neo4j", label: "planned_db", strength: 0.7 },
  { source: "proj-refactor", target: "system-design", label: "requires", strength: 0.7 },
];

const TYPE_LABELS: Record<GraphNode["type"], string> = {
  hub: "Core",
  topic: "Topic",
  person: "Person",
  project: "Project",
  resource: "Resource",
  place: "Place",
};

export default function ExplorePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);

  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.4);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  }, []);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const el = svgRef.current;
    const w = el.clientWidth || 900;
    const h = el.clientHeight || 600;

    const svg = d3.select(el);
    svg.selectAll("*").remove();

    // Defs: glow filter + arrow marker
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "node-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow marker
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "rgba(124,58,237,0.4)");

    const g = svg.append("g");

    // Zoom behaviour
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", String(event.transform));
        setZoom(Number(event.transform.k.toFixed(2)));
      });
    zoomRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    // Deep-copy nodes/links for simulation
    const nodes: GraphNode[] = NODES.map((n) => ({ ...n }));
    const links: GraphLink[] = LINKS.map((l) => ({ ...l }));

    // Force simulation
    const sim = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(90).strength((d) => (d as GraphLink).strength))
      .force("charge", d3.forceManyBody().strength(-280))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => d.size + 12));

    // Links
    const link = g.append("g").selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(124,58,237,0.25)")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Link labels
    const linkLabel = g.append("g").selectAll("text")
      .data(links)
      .join("text")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "9px")
      .attr("fill", "rgba(148,163,184,0.5)")
      .attr("text-anchor", "middle")
      .text((d) => d.label ?? "");

    // Node groups
    const dragBehavior = d3.drag<SVGGElement, GraphNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const node = (g.append("g").selectAll("g")
      .data(nodes)
      .join("g") as d3.Selection<SVGGElement, GraphNode, SVGGElement, unknown>)
      .style("cursor", "pointer")
      .call(dragBehavior)
      .on("click", (_event, d) => {
        setSelectedNode((prev) => (prev?.id === d.id ? null : d));
      });

    // Outer glow ring
    node.append("circle")
      .attr("r", (d) => d.size + 6)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 2);

    // Main circle
    node.append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => `${d.color}22`)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("filter", (d) => d.type === "hub" ? "url(#node-glow)" : "none");

    // Label
    node.append("text")
      .attr("dy", (d) => d.size + 14)
      .attr("text-anchor", "middle")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", (d) => (d.type === "hub" ? "11px" : "9px"))
      .attr("font-weight", (d) => (d.type === "hub" ? "700" : "500"))
      .attr("fill", (d) => d.type === "hub" ? "#a78bfa" : "#94a3b8")
      .text((d) => d.label);

    // Icon text for hub
    node.filter((d) => d.type === "hub")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", "16px")
      .text("🧠");

    // Hover highlight
    node.on("mouseenter", function (_event, d) {
      d3.select(this).select("circle:nth-child(2)")
        .attr("fill", `${d.color}44`)
        .attr("stroke-width", 3);
      // Fade unconnected links
      const connectedIds = new Set<string>();
      links.forEach((l) => {
        const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
        const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
        if (src === d.id || tgt === d.id) { connectedIds.add(src); connectedIds.add(tgt); }
      });
      link.attr("stroke-opacity", (l) => {
        const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
        const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
        return src === d.id || tgt === d.id ? 0.8 : 0.05;
      });
    }).on("mouseleave", function (_event, d) {
      d3.select(this).select("circle:nth-child(2)")
        .attr("fill", `${d.color}22`)
        .attr("stroke-width", 2);
      link.attr("stroke-opacity", 1);
    });

    // Tick
    sim.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      linkLabel
        .attr("x", (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr("y", (d) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, []);

  const legendItems: Array<[GraphNode["type"], string]> = [
    ["hub", "#7c3aed"],
    ["topic", "#06b6d4"],
    ["person", "#f59e0b"],
    ["project", "#10b981"],
    ["resource", "#a78bfa"],
    ["place", "#f43f5e"],
  ];

  return (
    <div className="page-wrapper" style={{ height: "100vh", overflow: "hidden" }}>
      <div className="glow-orb glow-orb-violet" aria-hidden="true" />

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "var(--space-4) var(--space-6)",
          background: "rgba(5,5,8,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>explore</div>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Memory <span className="gradient-text">Graph</span>
          </h1>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              background: "var(--bg-glass)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button id="explore-zoom-in" className="btn btn-secondary btn-sm" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn size={14} aria-hidden="true" />
          </button>
          <button id="explore-zoom-out" className="btn btn-secondary btn-sm" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut size={14} aria-hidden="true" />
          </button>
          <button id="explore-reset" className="btn btn-ghost btn-sm" onClick={handleReset} aria-label="Reset view">
            <RotateCcw size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <svg
        ref={svgRef}
        aria-label="Interactive memory graph showing connections between topics, people, projects, and resources"
        style={{
          width: "100%",
          height: "100vh",
          display: "block",
          background: "transparent",
        }}
      />

      {/* Legend */}
      <div
        style={{
          position: "fixed",
          bottom: "var(--space-6)",
          left: "var(--space-6)",
          zIndex: 10,
        }}
      >
        <div className="glass-card" style={{ padding: "var(--space-4)", minWidth: 140 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "var(--space-3)",
            }}
          >
            Node types
          </p>
          {legendItems.map(([type, color]) => (
            <div
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-2)",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: `${color}22`,
                  border: `2px solid ${color}`,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                {TYPE_LABELS[type]}
              </span>
            </div>
          ))}
          <div className="divider" style={{ margin: "var(--space-3) 0" }} />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
            }}
          >
            <Network size={10} style={{ display: "inline", marginRight: 4 }} aria-hidden="true" />
            {NODES.length} nodes · {LINKS.length} edges
          </p>
        </div>
      </div>

      {/* Selected Node Panel */}
      {selectedNode && (
        <div
          style={{
            position: "fixed",
            bottom: "var(--space-6)",
            right: "var(--space-6)",
            zIndex: 10,
            maxWidth: 300,
          }}
          role="dialog"
          aria-label={`Node details: ${selectedNode.label}`}
        >
          <div className="glass-card-elevated" style={{ padding: "var(--space-5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: `${selectedNode.color}22`,
                  border: `2px solid ${selectedNode.color}`,
                  flexShrink: 0,
                  boxShadow: `0 0 12px ${selectedNode.color}60`,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: selectedNode.color,
                  background: `${selectedNode.color}15`,
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {TYPE_LABELS[selectedNode.type]}
              </span>
              <button
                style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}
                onClick={() => setSelectedNode(null)}
                aria-label="Close node details"
              >
                ×
              </button>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                color: "var(--text-primary)",
                marginBottom: "var(--space-2)",
              }}
            >
              {selectedNode.label}
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {selectedNode.desc}
            </p>
            <div style={{ marginTop: "var(--space-3)", display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <Info size={11} aria-hidden="true" />
              Click another node to explore
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
