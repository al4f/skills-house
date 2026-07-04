import { Link } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Layout } from "@/components/Layout";
import { PageMeta } from "@/components/ui";

const steps = [
  { title: "Create", body: "npx @skills-house/create scaffolds build + install tooling." },
  { title: "Build", body: "@skills-house/build compiles skills/ to spec-compliant skills-dist/." },
  { title: "Install", body: "@skills-house/install or skills.sh ships skills to any agent." },
];

export function HomePage() {
  return (
    <Layout active="home" variant="landing" className="page-home">
      <PageMeta
        title="Skills House — Framework for Agent Skills"
        description="Author, build, and ship Agent Skills. Open-source framework by al4f."
        path="/"
      />

      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden="true">
          <div className="landing-mesh landing-mesh-1" />
          <div className="landing-mesh landing-mesh-2" />
          <div className="landing-grid" />
        </div>

        <div className="landing-container landing-hero-inner">
          <h1 className="landing-hero-title">
            Author, build, and ship <span className="landing-gradient">Agent Skills</span>
          </h1>

          <p className="landing-hero-lead">
            Open-source framework. Freeform source, one build step, install to Cursor, Claude, Codex, and more.
          </p>

          <div className="landing-hero-cta">
            <CodeSnippet code="npx @skills-house/create my-app" label="Get started" />
            <div className="landing-hero-actions">
              <Link to="/platform" className="btn btn-primary btn-lg">
                Framework docs
              </Link>
              <a
                href="https://github.com/al4f/skills-house"
                className="btn btn-ghost btn-lg"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-section-title">How it works</h2>
          <ol className="landing-pipeline-steps">
            {steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong> — {step.body}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="landing-section landing-section-subtle">
        <div className="landing-container">
          <div className="landing-example">
            <div className="landing-example-copy">
              <h2 className="landing-section-title">Example: skill-auditor</h2>
              <p>Validates Agent Skills before ship. Shows @include, references, and shared scripts.</p>
              <Link to="/skills/skill-auditor" className="btn btn-primary">
                View skill
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

@include /sections/workflow.md
Run [hello](fixture-helper/hello).`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
