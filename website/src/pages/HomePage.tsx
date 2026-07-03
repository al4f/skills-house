import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RegistrySearch } from "@/components/RegistrySearch";
import { PageMeta, Section, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

const featuredSkill = registry.skills[0];

const discoveryTags = Array.from(
  new Set(registry.skills.flatMap((skill) => skill.tags)),
).slice(0, 8);

export function HomePage() {
  return (
    <Layout active="home">
      <PageMeta
        title="Skills House — Agent Skills registry"
        description="Discover, install, and reuse AI Skills for Cursor, Claude Code, and Codex. Browse the registry, explore dependencies, and get started in minutes."
        path="/"
      />

      <Section className="hero">
        <p className="eyebrow">Open registry for Agent Skills</p>
        <h1 className="hero-title">
          Find, install, and reuse <span className="gradient-text">AI Skills</span>
        </h1>
        <p className="lead">
          Skills House is the reference registry for spec-compliant Agent Skills. Browse{" "}
          <strong>{registry.skills.length}</strong> skills and <strong>{registry.scripts.length}</strong> shared
          scripts, explore dependencies, and install into your agent with one command.
        </p>
        <div className="hero-actions">
          <Link to="/skills" className="btn btn-primary">
            Browse Skills
          </Link>
          <Link to="/platform" className="btn btn-secondary">
            How it works
          </Link>
          <a href={BRAND.repo} className="btn btn-ghost">
            Contribute on GitHub
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">{registry.skills.length}</span>
            <span className="stat-label">Skills</span>
          </div>
          <div className="stat">
            <span className="stat-value">{registry.scripts.length}</span>
            <span className="stat-label">Scripts</span>
          </div>
          <div className="stat">
            <span className="stat-value">Spec</span>
            <span className="stat-label">Compliant</span>
          </div>
        </div>
      </Section>

      <Section id="discover">
        <div className="section-header">
          <div>
            <h2>Discover skills</h2>
            <p>Search the registry or jump in by tag, type, or dependency.</p>
          </div>
        </div>
        <div className="discovery-panel">
          <div>
            <h3>Search the registry</h3>
            <p className="muted">Find skills, scripts, tags, and authors across the catalog.</p>
            <RegistrySearch variant="page" placeholder="Try “validation” or “auditor”…" />
          </div>
          <div>
            <h3>Browse by tag</h3>
            <p className="muted">Popular tags from published skills.</p>
            <div className="tag-cloud">
              {discoveryTags.length ? (
                discoveryTags.map((tag) => (
                  <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                    {tag}
                  </Tag>
                ))
              ) : (
                <span className="muted">Tags appear as skills are published.</span>
              )}
            </div>
            <p className="section-cta">
              <Link to="/graph">Explore dependency graph →</Link>
            </p>
          </div>
        </div>
        <div className="landing-grid">
          <Link to="/skills" className="landing-card">
            <span className="landing-card-icon">SK</span>
            <h3>Skills Explorer</h3>
            <p>Table of every skill with author, tags, version, and install command.</p>
          </Link>
          <Link to="/scripts" className="landing-card">
            <span className="landing-card-icon">SC</span>
            <h3>Scripts Explorer</h3>
            <p>Shared script packages referenced by skills across the ecosystem.</p>
          </Link>
          <Link to="/graph" className="landing-card">
            <span className="landing-card-icon">GR</span>
            <h3>Dependency Graph</h3>
            <p>See how skills connect to scripts and to each other.</p>
          </Link>
          <Link to="/search" className="landing-card">
            <span className="landing-card-icon">SR</span>
            <h3>Global Search</h3>
            <p>One search box for skills, scripts, tags, and authors.</p>
          </Link>
        </div>
      </Section>

      <Section id="getting-started">
        <div className="section-header">
          <div>
            <h2>Getting started</h2>
            <p>From discovery to a working skill in your agent.</p>
          </div>
        </div>

        <div className="callout callout-info">
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="callout-body">
            <strong>New here?</strong> Start by browsing the registry, pick a skill that fits your workflow, then
            run its install command in your terminal. Skills appear in your agent automatically.
          </div>
        </div>

        <div className="quick-start">
          <div className="quick-start-step">
            <h3>Discover a skill</h3>
            <p>Use search, tags, or the Skills Explorer to find what you need.</p>
            <Link to="/skills">Open Skills Explorer →</Link>
          </div>
          <div className="quick-start-step">
            <h3>Review the detail page</h3>
            <p>Each skill shows its description, scripts, dependencies, and install command.</p>
            {featuredSkill ? (
              <Link to={`/skills/${featuredSkill.id}`}>View {featuredSkill.name} →</Link>
            ) : (
              <span className="muted">Skill pages appear as content is published.</span>
            )}
          </div>
          <div className="quick-start-step">
            <h3>Install into your agent</h3>
            <p>Copy the install command from the skill page and run it locally.</p>
            {featuredSkill && (
              <div className="code-block">
                <span className="code-block-label">Terminal</span>
                <pre>
                  <code>{featuredSkill.installCommand}</code>
                </pre>
              </div>
            )}
          </div>
          <div className="quick-start-step">
            <h3>Use in your agent</h3>
            <p>After install, invoke the skill from Cursor, Claude Code, or Codex when the task matches.</p>
            <Link to="/writing/agent-skills-at-scale">Read: Agent Skills at Scale →</Link>
          </div>
        </div>
      </Section>

      <Section id="publish">
        <div className="section-header">
          <div>
            <h2>Publish your own skill</h2>
            <p>Contributors author in GitHub; this site regenerates from repository metadata.</p>
          </div>
        </div>
        <ol className="steps-list">
          <li>
            Create a skill in <code>skills/&lt;name&gt;/</code> with a valid <code>SKILL.md</code>
          </li>
          <li>Open a pull request — CI validates schema, links, and layout conventions</li>
          <li>When checks pass, the PR auto-merges and the registry updates on deploy</li>
        </ol>
        <p className="section-cta">
          <a href={BRAND.repo}>View repository →</a>
        </p>
      </Section>

      <Section className="about-section">
        <h2>About</h2>
        <p>
          Skills House is built by <strong>al4f</strong> as open-source infrastructure for Agent Skills — the build
          pipelines, authoring conventions, and distribution patterns that make skills maintainable at scale.
        </p>
        <p>
          <Link to="/platform">Platform overview</Link> · <Link to="/writing">Writing</Link> ·{" "}
          <a href={BRAND.docs}>Architecture specs</a>
        </p>
      </Section>
    </Layout>
  );
}
