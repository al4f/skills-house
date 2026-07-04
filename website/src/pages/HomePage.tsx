import { Link } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { LayerDiagram } from "@/components/LayerDiagram";
import { Layout } from "@/components/Layout";
import { PageMeta } from "@/components/ui";

const problems = [
  {
    title: "Skills sprawl",
    desc: "Every skill is a monolithic SKILL.md. Context burns. Duplication creeps in.",
  },
  {
    title: "Manual shipping",
    desc: "Copy-paste into ~/.cursor/skills, .agents/skills, .claude/skills — per agent, per machine.",
  },
  {
    title: "No build step",
    desc: "Source and what agents load are the same file. No validation, no composition, no pipeline.",
  },
];

const pillars = [
  {
    icon: "01",
    title: "Source is freeform",
    desc: "Write skills like docs. Only SKILL.md is required. @include fragments, markdown links for references and scripts.",
    accent: "skill",
  },
  {
    icon: "02",
    title: "Build is deterministic",
    desc: "@skills-house/build compiles markers and links into spec-compliant Agent Skills layout — every time.",
    accent: "framework",
  },
  {
    icon: "03",
    title: "Ship to any agent",
    desc: "One dist output installs to Cursor, Claude, Codex, mobile agents — global or project-local.",
    accent: "agent",
  },
  {
    icon: "04",
    title: "Skills are live work",
    desc: "Not copy-paste demos. Agents discover, load, and execute skills when tasks match. Real agentic capabilities.",
    accent: "skill",
  },
  {
    icon: "05",
    title: "Shared scripts",
    desc: "Reference fixture-helper/hello instead of duplicating shell scripts across every skill package.",
    accent: "script",
  },
  {
    icon: "06",
    title: "Framework, not catalog",
    desc: "Fork, author your own skills, ship from your repo. We ship one example — you own the rest.",
    accent: "framework",
  },
];

const comparisons = [
  { without: "Monolithic SKILL.md files", with: "Composable source with @include" },
  { without: "Manual copy to agent dirs", with: "pnpm build → npx skills add" },
  { without: "Duplicated scripts per skill", with: "Shared scripts/ packages" },
  { without: "Hope it works in production", with: "Validate before ship" },
];

export function HomePage() {
  return (
    <Layout active="home" variant="landing" className="page-home">
      <PageMeta
        title="Skills House — The framework layer for agent skills"
        description="The missing layer between agentic development and skills at scale. Author, build, and ship Agent Skills to Cursor, Claude, Codex, and more."
        path="/"
      />

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden="true">
          <div className="landing-mesh landing-mesh-1" />
          <div className="landing-mesh landing-mesh-2" />
          <div className="landing-grid" />
        </div>

        <div className="landing-container landing-hero-inner">
          <div className="landing-hero-badge">
            <span className="landing-pulse" aria-hidden="true" />
            Open source framework
          </div>

          <h1 className="landing-hero-title">
            The layer between
            <br />
            <span className="landing-gradient">agentic dev</span>
            <span className="landing-hero-and"> &amp; </span>
            <span className="landing-gradient-alt">skills at scale</span>
          </h1>

          <p className="landing-hero-lead">
            Agent Skills are how you teach AI agents to do real work. skills-house is the framework that sits
            between writing those skills and running them in production — compile, validate, and ship to every
            agent runtime from one pipeline.
          </p>

          <div className="landing-hero-cta">
            <CodeSnippet code="npx create-skills-house my-app" label="Get started" />
            <div className="landing-hero-actions">
              <Link to="/platform" className="btn btn-primary btn-lg">
                How it works
              </Link>
              <Link to="/learn" className="btn btn-ghost btn-lg">
                New to skills? Start here
              </Link>
            </div>
          </div>

          <div className="landing-hero-stats">
            <div className="landing-stat">
              <span className="landing-stat-value">1 cmd</span>
              <span className="landing-stat-label">to scaffold</span>
            </div>
            <div className="landing-stat-divider" aria-hidden="true" />
            <div className="landing-stat">
              <span className="landing-stat-value">Any agent</span>
              <span className="landing-stat-label">Cursor · Claude · Codex</span>
            </div>
            <div className="landing-stat-divider" aria-hidden="true" />
            <div className="landing-stat">
              <span className="landing-stat-value">MIT</span>
              <span className="landing-stat-label">open source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="landing-section" id="philosophy">
        <div className="landing-container">
          <div className="landing-section-header landing-section-header-center">
            <p className="landing-eyebrow">Philosophy</p>
            <h2 className="landing-section-title">
              Agentic development needs infrastructure
            </h2>
            <p className="landing-section-desc">
              You can write a SKILL.md today. You can paste it into Cursor tomorrow. But when you have ten
              skills, three agents, and a team — you need a layer that handles composition, validation, and
              delivery. That layer is skills-house.
            </p>
          </div>

          <LayerDiagram />

          <blockquote className="landing-quote">
            <p>
              &ldquo;Like Next.js gave React a framework for shipping web apps, skills-house gives Agent Skills
              a framework for shipping agentic capabilities.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Problem */}
      <section className="landing-section landing-section-subtle">
        <div className="landing-container">
          <div className="landing-section-header">
            <p className="landing-eyebrow">The problem</p>
            <h2 className="landing-section-title">Skills break without a pipeline</h2>
          </div>

          <div className="landing-problem-grid">
            {problems.map((item) => (
              <article key={item.title} className="landing-problem-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="landing-compare">
            <div className="landing-compare-col landing-compare-without">
              <h3>Without skills-house</h3>
              <ul>
                {comparisons.map((row) => (
                  <li key={row.without}>{row.without}</li>
                ))}
              </ul>
            </div>
            <div className="landing-compare-col landing-compare-with">
              <h3>With skills-house</h3>
              <ul>
                {comparisons.map((row) => (
                  <li key={row.with}>{row.with}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars bento */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-header">
            <p className="landing-eyebrow">Principles</p>
            <h2 className="landing-section-title">Built for builders who ship</h2>
            <p className="landing-section-desc">
              Not just developers. Anyone building agentic apps with Cursor, Claude, or mobile agents —
              skills-house supplies structure; agents supply execution.
            </p>
          </div>

          <div className="landing-bento">
            {pillars.map((pillar) => (
              <article key={pillar.title} className={`landing-bento-card landing-bento-${pillar.accent}`}>
                <span className="landing-bento-icon">{pillar.icon}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="landing-section landing-section-subtle">
        <div className="landing-container">
          <div className="landing-pipeline">
            <div className="landing-pipeline-copy">
              <p className="landing-eyebrow">Pipeline</p>
              <h2 className="landing-section-title">From source to agent in three steps</h2>
              <ol className="landing-pipeline-steps">
                <li>
                  <strong>Author</strong> — Write skills in <code>skills/</code>, share logic via{" "}
                  <code>scripts/</code>
                </li>
                <li>
                  <strong>Build</strong> — <code>pnpm build</code> compiles to spec-compliant{" "}
                  <code>skills-dist/</code>
                </li>
                <li>
                  <strong>Ship</strong> — Install to any agent with{" "}
                  <code>npx skills add owner/repo --skill name</code>
                </li>
              </ol>
              <Link to="/platform" className="btn btn-secondary">
                Read the framework docs →
              </Link>
            </div>
            <div className="landing-pipeline-terminal">
              <div className="landing-terminal">
                <div className="landing-terminal-bar">
                  <span className="landing-terminal-dot" />
                  <span className="landing-terminal-dot" />
                  <span className="landing-terminal-dot" />
                  <span className="landing-terminal-title">terminal</span>
                </div>
                <pre className="landing-terminal-body">
                  <code>
                    <span className="t-dim"># Scaffold a new project</span>
                    {"\n"}
                    <span className="t-prompt">$</span> npx create-skills-house my-app
                    {"\n\n"}
                    <span className="t-dim"># Build all skills</span>
                    {"\n"}
                    <span className="t-prompt">$</span> pnpm build
                    {"\n\n"}
                    <span className="t-dim"># Install to Cursor</span>
                    {"\n"}
                    <span className="t-prompt">$</span> npx skills add al4f/skills-house{" "}
                    <span className="t-flag">--skill</span> skill-auditor
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example skill */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-example">
            <div className="landing-example-copy">
              <p className="landing-eyebrow">Live example</p>
              <h2 className="landing-section-title">See a skill in action</h2>
              <p>
                <code>skill-auditor</code> validates Agent Skills before ship — demonstrating @include,
                references, shared scripts, and the full build pipeline. One example skill, real patterns.
              </p>
              <Link to="/skills/skill-auditor" className="btn btn-primary">
                Explore skill-auditor
              </Link>
            </div>
            <div className="landing-example-preview">
              <div className="landing-code-preview">
                <div className="landing-code-preview-header">skills/skill-auditor/SKILL.md</div>
                <pre>
                  <code>{`---
name: skill-auditor
description: Validate Agent Skills before ship.
---

# Skill Auditor

@include /sections/workflow.md

Read [the guide](/references/deep-dive.md).
Run [hello](fixture-helper/hello).`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-card">
            <div className="landing-cta-glow" aria-hidden="true" />
            <h2>Ready to build agentic software?</h2>
            <p>
              Scaffold a project, author your first skill, and ship it to every agent — in minutes, not days.
            </p>
            <div className="landing-cta-actions">
              <CodeSnippet code="npx create-skills-house my-app" />
              <div className="landing-cta-links">
                <Link to="/learn" className="btn btn-primary btn-lg">
                  Start learning
                </Link>
                <a
                  href="https://github.com/al4f/skills-house"
                  className="btn btn-ghost btn-lg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
