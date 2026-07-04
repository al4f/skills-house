import { Link } from "react-router-dom";
import { HeroVisual } from "@/components/HeroVisual";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";

const exploreLinks = [
  {
    to: "/learn",
    label: "Learn",
    desc: "Plain-language guide",
    accent: "skill",
  },
  {
    to: "/platform",
    label: "Framework",
    desc: "Scaffold, build, ship",
    accent: "neutral",
  },
  {
    to: "/skills/skill-auditor",
    label: "Live skill",
    desc: "Agentic work in action",
    accent: "skill",
  },
  {
    to: "/writing",
    label: "Writing",
    desc: "Guides & architecture",
    accent: "neutral",
  },
];

export function HomePage() {
  return (
    <Layout active="home" className="page-home">
      <PageMeta
        title="Skills House — Teach your AI assistant new skills"
        description="Open-source framework to author agentic work skills and ship them to Cursor, Claude, Codex, and more. No programming background required."
        path="/"
      />

      <Section className="hero hero-landing">
        <div className="hero-landing-copy">
          <p className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />
            For builders, not just developers
          </p>
          <h1 className="hero-title">
            Agentic skills, <span className="gradient-text">made simple</span>
          </h1>
          <p className="lead">
            Write instructions that teach your AI assistant how to do real work — then ship them with one
            framework. Skills are live agentic capabilities on the framework, not copy-paste examples.
          </p>
          <pre className="hero-code">
            <code>npx create-skills-house my-app</code>
          </pre>
          <div className="hero-actions">
            <Link to="/learn" className="btn btn-primary">
              Start learning
            </Link>
            <Link to="/platform" className="btn btn-secondary">
              How it works
            </Link>
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

      <Section>
        <div className="learn-callout learn-callout-inline">
          <h2>New to programming? Start here.</h2>
          <p>
            The Learn guide walks you through skills, scaffolding, and installation in plain language — no
            jargon required. See exactly what <code>create-skills-house</code> builds and how agents use your
            skills to do work.
          </p>
          <Link to="/learn#demo" className="btn btn-ghost">
            View the scaffold demo →
          </Link>
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
