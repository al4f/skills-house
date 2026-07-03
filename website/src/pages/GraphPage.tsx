import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";
import type { DependencyGraph } from "@/lib/types";

type GraphNode = {
  id: string;
  type: "skill" | "script";
  label: string;
};

type GraphEdge = {
  from: string;
  to: string;
  kind: string;
};

function buildGraphData(graph: DependencyGraph, skillIds: Set<string>) {
  const nodes: GraphNode[] = [
    ...registry.skills.map((s) => ({ id: s.id, type: "skill" as const, label: s.name })),
    ...registry.scripts.map((s) => ({ id: s.id, type: "script" as const, label: s.name })),
  ];

  const edges: GraphEdge[] = [];
  Object.entries(graph.skillsToScripts).forEach(([skill, scriptList]) => {
    scriptList.forEach((script) => edges.push({ from: skill, to: script, kind: "uses" }));
  });
  Object.entries(graph.skillsToSkills).forEach(([skill, deps]) => {
    deps.forEach((dep) => edges.push({ from: skill, to: dep, kind: "depends" }));
  });

  return { nodes, edges, skillIds };
}

export function GraphPage() {
  const { nodes, edges, skillIds } = useMemo(
    () => buildGraphData(registry.graph, new Set(registry.skills.map((s) => s.id))),
    [],
  );
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const connections = useMemo(() => {
    if (!selected) return [];
    const graph = registry.graph;
    if (selected.type === "skill") {
      return [
        ...(graph.skillsToScripts[selected.id] ?? []).map((id) => ({ type: "script" as const, id })),
        ...(graph.skillsToSkills[selected.id] ?? []).map((id) => ({ type: "skill" as const, id })),
      ];
    }
    return (graph.scriptsToSkills[selected.id] ?? []).map((id) => ({ type: "skill" as const, id }));
  }, [selected]);

  return (
    <Layout active="graph">
      <PageMeta
        title="Dependency Graph"
        description="Visualize skill and script relationships"
        path="/graph"
      />

      <Section className="page-header">
        <h1>Dependency Graph</h1>
        <p>Bidirectional relationships between skills and scripts. Click a node to explore connections.</p>
      </Section>

      <div className="graph-layout">
        <div className="graph-nodes" aria-label="Dependency graph visualization">
          {nodes.map((node) => (
            <button
              key={`${node.type}-${node.id}`}
              type="button"
              className={`graph-node graph-node-${node.type} ${selected?.id === node.id ? "selected" : ""}`}
              onClick={() => setSelected(node)}
            >
              <span className="graph-node-type">{node.type}</span>
              <span className="graph-node-label">{node.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <aside className="graph-detail">
            <h2>
              {selected.label} <span className="graph-detail-type">({selected.type})</span>
            </h2>
            {connections.length ? (
              <ul className="link-list">
                {connections.map((item) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link to={`/${item.type}s/${item.id}`}>{item.id}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No connections.</p>
            )}
          </aside>
        )}
      </div>

      <Section>
        <h2>All edges</h2>
        <div className="graph-edges">
          {edges.map((edge, i) => {
            const fromType = skillIds.has(edge.from) ? "skills" : "scripts";
            const toType = skillIds.has(edge.to) ? "skills" : "scripts";
            return (
              <p key={i} className="graph-edge">
                <Link to={`/${fromType}/${edge.from}`}>{edge.from}</Link>
                <span className="edge-arrow">→</span>
                <Link to={`/${toType}/${edge.to}`}>{edge.to}</Link>
                <span className="edge-kind">{edge.kind}</span>
              </p>
            );
          })}
        </div>
      </Section>
    </Layout>
  );
}
