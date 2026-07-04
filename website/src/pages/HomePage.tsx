import { Link } from "react-router-dom";
import { HeroVisual } from "@/components/HeroVisual";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { BRAND } from "@/lib/types";

const exploreLinks = [
  {
    to: "/platform",
    label: "Framework",
    desc: "Scaffold, build, ship",
    accent: "neutral",
  },
  {
    to: "/writing",
    label: "Writing",
    desc: "Guides & architecture",
    accent: "neutral",
  },
  {
    to: "/skills/skill-auditor",
    label: "Example skill",
    desc: "skill-auditor patterns",
    accent: "skill",
  },
  {
    to: BRAND.repo,
    label: "GitHub",
    desc: "Source & specs",
    accent: "neutral",
    external: true,
  },
] as const;

export function HomePage() {
  return (
    <Layout active="home" className="page-home">
      <PageMeta
        title="Skills House — Framework for Agent Skills"
        description="Open-source framework to scaffold, author, build, and ship agentic skill-based software with Agent Skills. Not a skill catalog."
        path="/"
      />

      <Section className="hero hero-landing">
        <div className="hero-landing-copy">
          <p className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />
            Open-source framework
          </p>
          <h1 className="hero-title">
            Agent Skills, <span className="gradient-text">at scale</span>
          </h1>
          <p className="lead">
            Scaffold a project, author skills in freeform source, compile to spec-compliant dist, and ship to
            Cursor, Claude, Codex, and more — with one command per skill via skills.sh.
          </p>
          <pre className="hero-code">
            <code>npx create-skills-house my-app</code>
          </pre>
          <div className="hero-actions">
            <Link to="/platform" className="btn btn-primary">
              How it works
            </Link>
            <a href={BRAND.repo} className="btn btn-secondary" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
        <HeroVisual />
      </Section>

      <Section className="explore-section">
        <div className="explore-grid">
          {exploreLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.to}
                className={`explore-card explore-card-${item.accent}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="explore-card-label">{item.label}</span>
                <span className="explore-card-desc">{item.desc}</span>
              </a>
            ) : (
              <Link key={item.to} to={item.to} className={`explore-card explore-card-${item.accent}`}>
                <span className="explore-card-label">{item.label}</span>
                <span className="explore-card-desc">{item.desc}</span>
              </Link>
            ),
          )}
        </div>
      </Section>

      <Section className="cta-section">
        <div className="cta-panel">
          <div className="cta-panel-copy">
            <h2>Install a skill in any repo</h2>
            <p>
              Primary path: official skills.sh CLI installs from your framework repo on GitHub — source layout,
              not pre-built dist.
            </p>
            <pre>
              <code>npx skills add al4f/skills-house --skill skill-auditor</code>
            </pre>
          </div>
          <a
            href="https://github.com/al4f/skills-house/blob/main/content/publish/INSTALL.md"
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            Install guide
          </a>
        </div>
      </Section>
    </Layout>
  );
}
