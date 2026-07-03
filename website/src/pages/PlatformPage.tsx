import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Badge, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function PlatformPage() {
  return (
    <Layout active="platform">
      <PageMeta
        title="Platform overview"
        description="How Skills House works — publish, validate, and distribute Agent Skills from GitHub to the registry."
        path="/platform"
      />

      <Section className="hero hero-compact">
        <p className="eyebrow">Platform overview</p>
        <h1 className="hero-title">
          GitHub is the source. <span className="gradient-text">This site is the registry.</span>
        </h1>
        <p className="lead">
          Skills House connects repository metadata to a browsable catalog. Contributors author skills in GitHub; CI
          validates and auto-merges; this site regenerates on every merge.
        </p>
        <div className="hero-actions">
          <Link to="/skills" className="btn btn-primary">
            Browse Skills
          </Link>
          <Link to="/" className="btn btn-secondary">
            Getting started guide
          </Link>
          <a href={BRAND.repo} className="btn btn-ghost">
            Contribute on GitHub
          </a>
        </div>
      </Section>

      <Section>
        <div className="feature-card">
          <div className="feature-card-media">
            <img src="./assets/diagram-pipeline.svg" alt="skills-house pipeline diagram" width={720} height={240} />
          </div>
          <div className="feature-card-body">
            <h3>Author → Build → Registry → Install</h3>
            <p>
              Skills are modular markdown packages with shared scripts. The build pipeline produces spec-compliant
              artifacts; the registry exposes them for discovery and one-command install.
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
        <h2>Published skills</h2>
        <div className="registry-grid">
          {registry.skills.length ? (
            registry.skills.map((skill) => (
              <article key={skill.id} className="registry-card">
                <h3>
                  <Link to={`/skills/${skill.id}`}>{skill.name}</Link>
                </h3>
                <p>{skill.description}</p>
                <div className="meta-row">
                  <Badge>v{skill.version}</Badge>
                  {skill.tags.map((tag) => (
                    <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <strong>No skills published yet</strong>
              <p>Contribute a skill on GitHub to populate the registry.</p>
            </div>
          )}
        </div>
        <p className="section-cta">
          <Link to="/skills">View all skills →</Link>
        </p>
      </Section>

      <Section>
        <h2>Contribution workflow</h2>
        <ol className="steps-list">
          <li>
            Author a skill in <code>skills/&lt;name&gt;/</code> on GitHub
          </li>
          <li>CI validates schema, lint, docs, and dependencies</li>
          <li>Skill PRs auto-merge when checks pass — no maintainer wait</li>
          <li>This site regenerates from repository metadata on every merge</li>
        </ol>
      </Section>
    </Layout>
  );
}
