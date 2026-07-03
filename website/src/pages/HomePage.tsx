import { Link } from "react-router-dom";
import { HeroVisual } from "@/components/HeroVisual";
import { Layout } from "@/components/Layout";
import { RegistrySearch } from "@/components/RegistrySearch";
import { PageMeta, Section, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

const discoveryTags = Array.from(
  new Set(registry.skills.flatMap((skill) => skill.tags)),
).slice(0, 6);

const exploreLinks = [
  {
    to: "/skills",
    label: "Skills",
    desc: "Browse the catalog",
    accent: "skill",
  },
  {
    to: "/scripts",
    label: "Scripts",
    desc: "Shared packages",
    accent: "script",
  },
  {
    to: "/graph",
    label: "Graph",
    desc: "See dependencies",
    accent: "neutral",
  },
  {
    to: "/writing",
    label: "Writing",
    desc: "Guides & essays",
    accent: "neutral",
  },
] as const;

export function HomePage() {
  return (
    <Layout active="home" className="page-home">
      <PageMeta
        title="Skills House — Agent Skills registry"
        description="Discover, install, and reuse AI Skills for Cursor, Claude Code, and Codex. Browse the registry, explore dependencies, and get started in minutes."
        path="/"
      />

      <Section className="hero hero-landing">
        <div className="hero-landing-copy">
          <p className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />
            Open registry
          </p>
          <h1 className="hero-title">
            Agent Skills, <span className="gradient-text">discovered</span>
          </h1>
          <p className="lead">
            Spec-compliant skills and scripts for Cursor, Claude Code, and Codex — browse, explore, install.
          </p>
          <div className="hero-search">
            <RegistrySearch variant="page" placeholder="Search skills, scripts, tags…" />
          </div>
          <div className="hero-actions">
            <Link to="/skills" className="btn btn-primary">
              Browse Skills
            </Link>
            <Link to="/platform" className="btn btn-secondary">
              How it works
            </Link>
          </div>
          <div className="hero-stats hero-stats-inline">
            <span>
              <strong>{registry.skills.length}</strong> skills
            </span>
            <span className="hero-stat-divider" aria-hidden="true" />
            <span>
              <strong>{registry.scripts.length}</strong> scripts
            </span>
            <span className="hero-stat-divider" aria-hidden="true" />
            <span>Spec compliant</span>
          </div>
        </div>
        <HeroVisual />
      </Section>

      <Section className="explore-section">
        <div className="explore-grid">
          {exploreLinks.map((item) => (
            <Link key={item.to} to={item.to} className={`explore-card explore-card-${item.accent}`}>
              <span className="explore-card-label">{item.label}</span>
              <span className="explore-card-desc">{item.desc}</span>
            </Link>
          ))}
        </div>
      </Section>

      {discoveryTags.length > 0 && (
        <Section className="tags-section">
          <p className="tags-section-label">Popular tags</p>
          <div className="tag-cloud">
            {discoveryTags.map((tag) => (
              <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                {tag}
              </Tag>
            ))}
          </div>
        </Section>
      )}

      <Section className="cta-section">
        <div className="cta-panel">
          <div className="cta-panel-copy">
            <h2>Publish a skill</h2>
            <p>Author in GitHub, validate with CI, auto-merge when checks pass.</p>
          </div>
          <a href={BRAND.repo} className="btn btn-primary">
            Contribute on GitHub
          </a>
        </div>
      </Section>
    </Layout>
  );
}
