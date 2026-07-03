import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { writingPosts } from "@/lib/writing";
import { registry } from "@/lib/registry";

export function HomePage() {
  return (
    <Layout active="home">
      <PageMeta
        title="al4f — Agent Skills infrastructure"
        description="al4f builds infrastructure for Agent Skills. Author of skills-house — an open-source toolkit for writing, building, and distributing skills across Cursor, Claude Code, and Codex."
        path="/"
      />

      <Section className="hero">
        <p className="eyebrow">
          <span className="pulse-dot" aria-hidden="true" />
          Agent Skills tooling engineer
        </p>
        <h1 className="hero-title">
          Infrastructure for <span className="gradient-text">Agent Skills</span>
        </h1>
        <p className="lead">
          <Link to="/platform">Skills House</Link> — the official platform to{" "}
          <strong>publish, discover, and reuse AI Skills</strong>. Author with modular markdown and shared scripts;
          the build pipeline produces spec-compliant artifacts ready to install into any supported agent.
        </p>
        <div className="hero-actions">
          <Link to="/platform" className="btn btn-primary">
            Explore Skills House
          </Link>
          <Link to="/skills" className="btn btn-secondary">
            Browse Skills
          </Link>
          <Link to="/writing/agent-skills-at-scale" className="btn btn-ghost">
            Read: Agent Skills at Scale
          </Link>
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
            <span className="stat-value">Open</span>
            <span className="stat-label">Source</span>
          </div>
        </div>
      </Section>

      <Section>
        <div className="section-header">
          <h2>Skills House Platform</h2>
          <p>GitHub is the backend. This site is the product.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card-media">
            <img src="./assets/diagram-pipeline.svg" alt="skills-house pipeline diagram" width={720} height={240} />
          </div>
          <div className="feature-card-body">
            <h3>
              <Link to="/platform">Skills House</Link>
            </h3>
            <p>
              Browse skills, scripts, dependency graphs, and install with one command. Skill PRs auto-merge when
              validation passes.
            </p>
            <ul className="feature-list">
              <li>
                <Link to="/skills">Skills Explorer</Link>
              </li>
              <li>
                <Link to="/scripts">Scripts Explorer</Link>
              </li>
              <li>
                <Link to="/graph">Dependency Graph</Link>
              </li>
              <li>
                <Link to="/search">Global Search</Link>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="section-header">
          <h2>Writing</h2>
          <Link to="/writing" className="section-link">
            All articles →
          </Link>
        </div>
        <ul className="post-list">
          {writingPosts.map((post) => (
            <li key={post.slug}>
              <Link to={`/writing/${post.slug}`} className="post-item">
                <span className="post-title">{post.title}</span>
                <span className="post-date">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="about-section">
        <h2>About</h2>
        <p>
          I'm <strong>al4f</strong>. I build tools around AI agents and focus on the infrastructure layer — the build
          pipelines, authoring conventions, and distribution patterns that make Agent Skills maintainable at scale.
        </p>
        <p>
          I share architecture notes and build logs here. If you're authoring skills for production use,{" "}
          <a href="https://github.com/al4f/skills-house">skills-house</a> is my reference implementation.
        </p>
      </Section>
    </Layout>
  );
}
