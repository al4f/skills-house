import type { DependencyGraph, Registry, ScriptEntry, SkillEntry } from "./types.js";

const BRAND = {
  site: "Skills House",
  author: "al4f",
  authorUrl: "https://al4f.dev",
  repo: "https://github.com/al4f/skills-house",
  docs: "https://github.com/al4f/skills-house/tree/main/specs",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function depthPrefix(depth: number): string {
  return depth === 0 ? "" : "../".repeat(depth);
}

function siteHeader(depth: number, active?: string): string {
  const p = depthPrefix(depth);
  const link = (href: string, label: string, key: string) =>
    `<a href="${p}${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="site-header">
    <a href="${p}index.html" class="logo">al4f</a>
    <nav>
      ${link("platform/", "Skills House", "platform")}
      ${link("skills/", "Skills", "skills")}
      ${link("scripts/", "Scripts", "scripts")}
      ${link("graph/", "Graph", "graph")}
      ${link("search/", "Search", "search")}
      ${link("writing/", "Writing", "writing")}
      <a href="${BRAND.repo}">GitHub</a>
    </nav>
  </header>`;
}

function siteFooter(depth: number): string {
  const p = depthPrefix(depth);
  return `<footer class="site-footer platform-footer">
    <p>
      <strong>${BRAND.site}</strong> by <a href="${BRAND.authorUrl}">${BRAND.author}</a>
      · <a href="${BRAND.repo}">GitHub</a>
      · <a href="${BRAND.docs}">Documentation</a>
      · <a href="${p}feed.xml">RSS</a>
    </p>
  </footer>`;
}

function pageShell(
  depth: number,
  title: string,
  description: string,
  active: string,
  body: string,
): string {
  const p = depthPrefix(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Skills House by al4f</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)} — Skills House">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="https://al4f.dev/${p.replace(/^\.\.\//, "")}">
  <link rel="stylesheet" href="${p}styles.css">
  <link rel="stylesheet" href="${p}platform.css">
</head>
<body>
  ${siteHeader(depth, active)}
  <main class="platform-main">
    ${body}
  </main>
  ${siteFooter(depth)}
</body>
</html>`;
}

export function renderPlatformHome(registry: Registry): string {
  const skillCards = registry.skills
    .map(
      (s) => `<article class="registry-card">
        <h3><a href="skills/${s.id}/">${escapeHtml(s.name)}</a></h3>
        <p>${escapeHtml(s.description)}</p>
        <div class="meta-row">
          <span class="badge">v${escapeHtml(s.version)}</span>
          ${s.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </article>`,
    )
    .join("\n");

  const body = `<section class="platform-hero">
      <p class="eyebrow">Official Skills House ecosystem</p>
      <h1>Publish, discover, and reuse AI Skills</h1>
      <p class="lead">
        GitHub is the source of truth. This site is the experience — browse
        <strong>${registry.skills.length}</strong> skills and
        <strong>${registry.scripts.length}</strong> shared scripts, explore dependencies,
        and install with one command.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="skills/">Browse Skills</a>
        <a class="button" href="graph/">Dependency Graph</a>
        <a class="button" href="${BRAND.repo}">Contribute on GitHub</a>
      </div>
    </section>
    <section>
      <h2>Latest Skills</h2>
      <div class="registry-grid">${skillCards || "<p>No skills published yet.</p>"}</div>
      <p><a href="skills/">View all skills →</a></p>
    </section>
    <section>
      <h2>How it works</h2>
      <ol class="steps-list">
        <li>Author a skill in <code>skills/&lt;name&gt;/</code> on GitHub</li>
        <li>CI validates schema, lint, docs, and dependencies</li>
        <li>Skill PRs auto-merge when checks pass — no maintainer wait</li>
        <li>This site regenerates from repository metadata on every merge</li>
      </ol>
    </section>`;

  return pageShell(1, "Skills House", "Official platform for publishing and discovering AI Skills", "platform", body);
}

export function renderSkillsIndex(skills: SkillEntry[]): string {
  const rows = skills
    .map(
      (s) => `<tr>
        <td><a href="${s.id}/">${escapeHtml(s.name)}</a></td>
        <td>${escapeHtml(s.description.slice(0, 120))}${s.description.length > 120 ? "…" : ""}</td>
        <td>${escapeHtml(s.author)}</td>
        <td>${s.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(" ")}</td>
        <td><code>v${escapeHtml(s.version)}</code></td>
      </tr>`,
    )
    .join("\n");

  const body = `<section class="page-header">
      <h1>Skills Explorer</h1>
      <p>Every skill in the Skills House registry, generated from repository metadata.</p>
    </section>
    <div class="table-wrap">
      <table class="registry-table">
        <thead>
          <tr><th>Skill</th><th>Description</th><th>Author</th><th>Tags</th><th>Version</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  return pageShell(1, "Skills Explorer", "Browse all AI Skills in Skills House", "skills", body);
}

export function renderSkillPage(skill: SkillEntry, scripts: ScriptEntry[]): string {
  const scriptLinks = skill.scripts
    .map((s) => {
      const script = scripts.find((r) => r.id === s.package);
      const label = s.label || `${s.package}/${s.export}`;
      return script
        ? `<li><a href="../../scripts/${s.package}/">${escapeHtml(label)}</a> <code>${escapeHtml(s.package)}/${escapeHtml(s.export)}</code></li>`
        : `<li><code>${escapeHtml(s.package)}/${escapeHtml(s.export)}</code></li>`;
    })
    .join("\n");

  const depLinks = skill.dependencies
    .map((d) => `<li><a href="../${d}/">${escapeHtml(d)}</a></li>`)
    .join("\n");

  const examples = skill.examples
    .map((e) => `<pre><code>${escapeHtml(e)}</code></pre>`)
    .join("\n");

  const body = `<nav class="breadcrumb"><a href="../">Skills</a> / ${escapeHtml(skill.name)}</nav>
    <article class="detail-page">
      <header>
        <h1>${escapeHtml(skill.name)}</h1>
        <p class="lead">${escapeHtml(skill.description)}</p>
        <div class="meta-row">
          <span>By <a href="../../search/?q=${encodeURIComponent(skill.author)}">${escapeHtml(skill.author)}</a></span>
          <span class="badge">v${escapeHtml(skill.version)}</span>
          ${skill.tags.map((t) => `<a class="tag" href="../../search/?q=${encodeURIComponent(t)}">${escapeHtml(t)}</a>`).join("")}
        </div>
      </header>

      <section>
        <h2>Install</h2>
        <pre><code>${escapeHtml(skill.installCommand)}</code></pre>
      </section>

      ${skill.scripts.length ? `<section><h2>Scripts used</h2><ul>${scriptLinks}</ul></section>` : ""}
      ${skill.dependencies.length ? `<section><h2>Related skills</h2><ul>${depLinks}</ul></section>` : ""}
      ${skill.references.length ? `<section><h2>References</h2><ul>${skill.references.map((r) => `<li><code>${escapeHtml(r)}</code></li>`).join("")}</ul></section>` : ""}
      ${examples ? `<section><h2>Examples</h2>${examples}</section>` : ""}

      <section>
        <h2>Source</h2>
        <p><a href="${BRAND.repo}/tree/main/${skill.path}">View on GitHub</a></p>
      </section>
    </article>`;

  return pageShell(2, skill.name, skill.description, "skills", body);
}

export function renderScriptsIndex(scripts: ScriptEntry[]): string {
  const rows = scripts
    .map(
      (s) => `<tr>
        <td><a href="${s.id}/">${escapeHtml(s.name)}</a></td>
        <td>${escapeHtml(s.description.slice(0, 120))}${s.description.length > 120 ? "…" : ""}</td>
        <td>${s.skillsUsing.map((id) => `<a href="../skills/${id}/">${escapeHtml(id)}</a>`).join(", ") || "—"}</td>
        <td>${s.maintainers.map((m) => escapeHtml(m)).join(", ")}</td>
      </tr>`,
    )
    .join("\n");

  const body = `<section class="page-header">
      <h1>Scripts Explorer</h1>
      <p>Shared execution packages referenced by skills across the ecosystem.</p>
    </section>
    <div class="table-wrap">
      <table class="registry-table">
        <thead>
          <tr><th>Script</th><th>Description</th><th>Skills using</th><th>Maintainers</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  return pageShell(1, "Scripts Explorer", "Browse shared script packages in Skills House", "scripts", body);
}

export function renderScriptPage(script: ScriptEntry): string {
  const exports = script.exports
    .map((e) => `<tr><td><code>${escapeHtml(e.key)}</code></td><td><code>${escapeHtml(e.path)}</code></td></tr>`)
    .join("\n");

  const skills = script.skillsUsing
    .map((id) => `<li><a href="../../skills/${id}/">${escapeHtml(id)}</a></li>`)
    .join("\n");

  const examples = script.examples
    .map((e) => `<pre><code>${escapeHtml(e)}</code></pre>`)
    .join("\n");

  const body = `<nav class="breadcrumb"><a href="../">Scripts</a> / ${escapeHtml(script.name)}</nav>
    <article class="detail-page">
      <header>
        <h1>${escapeHtml(script.name)}</h1>
        <p class="lead">${escapeHtml(script.description)}</p>
        <div class="meta-row">
          <span>Maintainers: ${script.maintainers.map((m) => escapeHtml(m)).join(", ")}</span>
        </div>
      </header>

      <section>
        <h2>Exports</h2>
        <div class="table-wrap">
          <table class="registry-table">
            <thead><tr><th>Export</th><th>Path</th></tr></thead>
            <tbody>${exports}</tbody>
          </table>
        </div>
      </section>

      ${script.inputs.length ? `<section><h2>Inputs</h2><ul>${script.inputs.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul></section>` : ""}
      ${script.outputs.length ? `<section><h2>Outputs</h2><ul>${script.outputs.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul></section>` : ""}
      ${script.skillsUsing.length ? `<section><h2>Skills using this script</h2><ul>${skills}</ul></section>` : ""}
      ${examples ? `<section><h2>Examples</h2>${examples}</section>` : ""}

      <section>
        <h2>Source</h2>
        <p><a href="${BRAND.repo}/tree/main/${script.path}">View on GitHub</a></p>
      </section>
    </article>`;

  return pageShell(2, script.name, script.description, "scripts", body);
}

export function renderGraphPage(graph: DependencyGraph, skills: SkillEntry[], scripts: ScriptEntry[]): string {
  const data = JSON.stringify({ graph, skills: skills.map((s) => ({ id: s.id, name: s.name })), scripts: scripts.map((s) => ({ id: s.id, name: s.name })) });
  const body = `<section class="page-header">
      <h1>Dependency Graph</h1>
      <p>Bidirectional relationships between skills and scripts. Click a node to explore connections.</p>
    </section>
    <div id="graph-root" class="graph-container" aria-label="Dependency graph visualization"></div>
    <section id="graph-detail" class="graph-detail" hidden>
      <h2 id="graph-detail-title"></h2>
      <ul id="graph-detail-list"></ul>
    </section>
    <script type="application/json" id="graph-data">${data}</script>
    <script src="../graph/graph.js"></script>`;

  return pageShell(1, "Dependency Graph", "Visualize skill and script relationships", "graph", body);
}

export function renderSearchPage(): string {
  const body = `<section class="page-header">
      <h1>Search</h1>
      <p>Search skills, scripts, tags, and authors across the registry.</p>
    </section>
    <form class="search-form" role="search" onsubmit="return false;">
      <input type="search" id="search-input" placeholder="Search skills, scripts, tags, authors…" autocomplete="off" aria-label="Search registry">
    </form>
    <div id="search-results" class="search-results"></div>
    <script src="../search/search.js"></script>`;

  return pageShell(1, "Search", "Search the Skills House registry", "search", body);
}

export function graphJs(): string {
  return `(() => {
  const raw = document.getElementById("graph-data").textContent;
  const { graph, skills, scripts } = JSON.parse(raw);
  const root = document.getElementById("graph-root");
  const detail = document.getElementById("graph-detail");
  const detailTitle = document.getElementById("graph-detail-title");
  const detailList = document.getElementById("graph-detail-list");

  const nodes = [];
  skills.forEach((s) => nodes.push({ id: s.id, type: "skill", label: s.name }));
  scripts.forEach((s) => nodes.push({ id: s.id, type: "script", label: s.name }));

  const edges = [];
  Object.entries(graph.skillsToScripts).forEach(([skill, scriptList]) => {
    scriptList.forEach((script) => edges.push({ from: skill, to: script, kind: "uses" }));
  });
  Object.entries(graph.skillsToSkills).forEach(([skill, deps]) => {
    deps.forEach((dep) => edges.push({ from: skill, to: dep, kind: "depends" }));
  });

  function showDetail(node) {
    detail.hidden = false;
    detailTitle.textContent = node.label + " (" + node.type + ")";
    detailList.innerHTML = "";
    const items = node.type === "skill"
      ? (graph.skillsToScripts[node.id] || []).map((id) => ({ type: "script", id }))
          .concat((graph.skillsToSkills[node.id] || []).map((id) => ({ type: "skill", id })))
      : (graph.scriptsToSkills[node.id] || []).map((id) => ({ type: "skill", id }));
    if (!items.length) {
      const li = document.createElement("li");
      li.textContent = "No connections.";
      detailList.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.type === "skill" ? "../skills/" + item.id + "/" : "../scripts/" + item.id + "/";
      a.textContent = item.id;
      li.appendChild(a);
      detailList.appendChild(li);
    });
  }

  const cols = 4;
  const cellW = 180;
  const cellH = 56;
  root.innerHTML = '<div class="graph-grid"></div>';
  const grid = root.querySelector(".graph-grid");
  nodes.forEach((node, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "graph-node graph-node-" + node.type;
    btn.textContent = node.label;
    btn.style.gridColumn = (index % cols) + 1;
    btn.style.gridRow = Math.floor(index / cols) + 1;
    btn.addEventListener("click", () => showDetail(node));
    grid.appendChild(btn);
  });

  const edgeList = document.createElement("div");
  edgeList.className = "graph-edges";
  edges.forEach((edge) => {
    const p = document.createElement("p");
    const fromType = skills.some((s) => s.id === edge.from) ? "skill" : "script";
    const toType = skills.some((s) => s.id === edge.to) ? "skill" : "script";
    p.innerHTML = '<a href="../' + fromType + 's/' + edge.from + '/">' + edge.from + '</a> → <a href="../' + toType + 's/' + edge.to + '/">' + edge.to + '</a> <span class="edge-kind">' + edge.kind + '</span>';
    edgeList.appendChild(p);
  });
  root.appendChild(edgeList);
})();`;
}

export function searchJs(): string {
  return `(() => {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  let index = [];

  fetch("../data/search-index.json")
    .then((r) => r.json())
    .then((data) => { index = data; runSearch(); })
    .catch(() => { results.innerHTML = "<p>Could not load search index.</p>"; });

  const params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");

  input.addEventListener("input", runSearch);

  function runSearch() {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const matches = index.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(q))
    ).slice(0, 40);
    if (!matches.length) {
      results.innerHTML = "<p>No results.</p>";
      return;
    }
    results.innerHTML = matches.map((item) =>
      '<article class="search-hit"><span class="badge">' + item.type + '</span> ' +
      '<a href="../' + item.url + '"><strong>' + item.title + '</strong></a>' +
      '<p>' + item.description + '</p></article>'
    ).join("");
  }
})();`;
}

export function platformCss(): string {
  return `:root {
  --platform-accent: #3fb950;
  --skill-color: #58a6ff;
  --script-color: #d2a8ff;
}

.platform-main { max-width: var(--wide-width); }

.platform-hero { margin-bottom: 3rem; max-width: var(--max-width); }
.platform-hero h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 1rem; }

.registry-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  margin: 1.25rem 0;
}

.registry-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
}

.registry-card h3 { margin-bottom: 0.5rem; }
.registry-card p { color: var(--text-muted); font-size: 0.95rem; }

.meta-row { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-top: 0.75rem; }
.badge {
  font-family: var(--mono);
  font-size: 0.75rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  color: var(--text-muted);
}

.tag {
  font-family: var(--mono);
  font-size: 0.75rem;
  background: rgba(88, 166, 255, 0.12);
  border: 1px solid rgba(88, 166, 255, 0.35);
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  color: var(--accent);
  text-decoration: none;
}

.page-header { margin-bottom: 2rem; }
.page-header h1 { margin-bottom: 0.5rem; }
.page-header p { color: var(--text-muted); }

.table-wrap { overflow-x: auto; }
.registry-table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
.registry-table th, .registry-table td {
  text-align: left;
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.registry-table th { color: var(--text-muted); font-weight: 600; }

.breadcrumb { color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem; }
.detail-page section { margin: 2rem 0; }
.detail-page h2 { font-size: 1.1rem; margin-bottom: 0.75rem; }

.steps-list { padding-left: 1.25rem; color: var(--text-muted); }
.steps-list li { margin: 0.5rem 0; }

.platform-footer { border-top: 1px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; text-align: center; color: var(--text-muted); }

.graph-container { margin: 1rem 0 2rem; }
.graph-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.graph-node {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  background: var(--bg-elevated);
  color: var(--text);
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.85rem;
}
.graph-node-skill { border-color: rgba(88, 166, 255, 0.5); }
.graph-node-script { border-color: rgba(210, 168, 255, 0.5); }
.graph-node:hover { border-color: var(--accent); }
.graph-edges p { font-family: var(--mono); font-size: 0.85rem; margin: 0.35rem 0; color: var(--text-muted); }
.edge-kind { color: var(--platform-accent); }

.search-form { margin-bottom: 1.5rem; }
.search-form input {
  width: 100%;
  max-width: 520px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text);
  font-size: 1rem;
}
.search-hit { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.search-hit p { color: var(--text-muted); margin-top: 0.35rem; font-size: 0.92rem; }
`;
}
