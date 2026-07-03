import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Badge, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function PlatformPage() {
  return (
    <Layout active="platform">
      <PageMeta
        title="Skills House"
        description="Official platform for publishing and discovering AI Skills"
        path="/platform"
      />

      <Section className="hero hero-compact">
        <p className="eyebrow">Official Skills House ecosystem</p>
        <h1 className="hero-title">
          Publish, discover, and <span className="gradient-text">reuse AI Skills</span>
        </h1>
        <p className="lead">
          GitHub is the source of truth. This site is the experience — browse{" "}
          <strong>{registry.skills.length}</strong> skills and <strong>{registry.scripts.length}</strong> shared
          scripts, explore dependencies, and install with one command.
        </p>
        <div className="hero-actions">
          <Link to="/skills" className="btn btn-primary">
            Browse Skills
          </Link>
          <Link to="/graph" className="btn btn-secondary">
            Dependency Graph
          </Link>
          <a href={BRAND.repo} className="btn btn-ghost">
            Contribute on GitHub
          </a>
        </div>
      </Section>

      <Section>
        <h2>Latest Skills</h2>
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
            <p>No skills published yet.</p>
          )}
        </div>
        <p className="section-cta">
          <Link to="/skills">View all skills →</Link>
        </p>
      </Section>

      <Section>
        <h2>How it works</h2>
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
