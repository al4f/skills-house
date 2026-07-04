import { Link } from "react-router-dom";
import { CommandStack } from "@/components/CommandStack";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageMeta, Section } from "@/components/ui";
import { FRAMEWORK_COMMANDS } from "@/lib/commands";

const steps = [
  "Describe what the agent should do in SKILL.md.",
  "Scaffold a project with @skills-house/create.",
  "Compile skills with @skills-house/build.",
  "Install into your agent with @skills-house/install.",
  "The agent loads the skill when a task matches its description.",
];

export function LearnPage() {
  return (
    <Layout active="learn" className="page-learn">
      <PageMeta
        title="Getting started"
        description="Quick start with skills-house — scaffold, author, build, install."
        path="/learn"
      />

      <PageHero
        eyebrow="Getting started"
        title="Build your first skill"
        lead="Write instructions in plain language. The framework handles packaging and install."
        commands={FRAMEWORK_COMMANDS}
      />

      <Section>
        <h2 className="section-heading">Steps</h2>
        <ol className="learn-steps">
          {steps.map((step, i) => (
            <li key={i} className="learn-step">
              <span className="learn-step-num" aria-hidden="true">
                {i + 1}
              </span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="section-heading">Core commands</h2>
        <CommandStack commands={FRAMEWORK_COMMANDS} />
        <pre className="learn-code-sample">
          <code>{`my-app/
  skills/my-app-skill/SKILL.md   ← edit this
  scripts/                       ← shared helpers
  skills-dist/                   ← @skills-house/build output
  internal-scripts/
    build/                       ← @skills-house/build
    install/                     ← @skills-house/install`}</code>
        </pre>
      </Section>

      <Section className="cta-section">
        <div className="landing-cta-card landing-cta-card-compact">
          <Link to="/platform" className="btn btn-primary">
            Framework overview
          </Link>
          <Link to="/skills/skill-auditor" className="btn btn-secondary">
            Example skill
          </Link>
        </div>
      </Section>
    </Layout>
  );
}
