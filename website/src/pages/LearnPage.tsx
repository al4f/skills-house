import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";

const steps = [
  {
    num: "1",
    title: "Describe what you want the agent to do",
    body: "Write a skill as plain instructions — like a job description for your AI assistant. You do not need to write code. Focus on the task, the steps, and when the agent should use this skill.",
  },
  {
    num: "2",
    title: "Scaffold a project with one command",
    body: "Run create-skills-house to get a ready-made folder structure. The framework sets up build tools, install scripts, and a starter skill you can edit immediately.",
  },
  {
    num: "3",
    title: "Build and install",
    body: "The build step packages your instructions into a format agents understand. Install puts the skill where Cursor, Claude, or Codex can find it — in your project or globally.",
  },
  {
    num: "4",
    title: "The agent does the work",
    body: "When a task matches your skill's description, the agent loads it automatically and follows your instructions. Skills are live agentic capabilities, not static examples to copy from.",
  },
];

const scaffoldTree = [
  { path: "my-app/", label: "Your project root", indent: 0 },
  { path: "skills/my-app-skill/", label: "Where you write agent instructions", indent: 1, highlight: "skill" },
  { path: "SKILL.md", label: "Main skill file — edit this", indent: 2, highlight: "skill" },
  { path: "sections/", label: "Break long instructions into parts", indent: 2 },
  { path: "references/", label: "Background docs the agent reads on demand", indent: 2 },
  { path: "scripts/", label: "Reusable helper scripts (optional)", indent: 1, highlight: "script" },
  { path: "fixture-helper/", label: "Starter helper package", indent: 2 },
  { path: "skills-dist/", label: "Built output — agents consume this (auto-generated)", indent: 1 },
  { path: "internal-scripts/", label: "Build & install tooling (pre-configured)", indent: 1 },
];

const glossary = [
  {
    term: "Agent",
    def: "An AI assistant in tools like Cursor, Claude, or Codex that reads your skills and follows them to complete tasks.",
  },
  {
    term: "Skill",
    def: "A packaged set of instructions that teaches an agent how to do a specific job — validation, onboarding, reporting, or any repeatable workflow.",
  },
  {
    term: "Agentic work",
    def: "Tasks the agent performs autonomously using your skill: checking files, following checklists, running scripts, and applying domain rules you define.",
  },
  {
    term: "Build",
    def: "Compiles your source instructions into a standard format agents can load. You run this after editing a skill.",
  },
  {
    term: "Install",
    def: "Copies built skills into the agent's skills folder so they become available in your editor or chat.",
  },
];

export function LearnPage() {
  return (
    <Layout active="learn" className="page-learn">
      <PageMeta
        title="Learn — Build agentic skills without coding"
        description="A plain-language guide to skills-house for people new to programming. Skills are live agentic work capabilities on the framework — not examples."
        path="/learn"
      />

      <Section className="hero hero-compact">
        <p className="eyebrow">Getting started guide</p>
        <h1 className="hero-title">
          Teach your AI assistant <span className="gradient-text">new skills</span>
        </h1>
        <p className="lead">
          You do not need a programming background. Skills House helps you write instructions that coding agents
          follow to do real work — and ships them with a single framework. Skills are not demos or samples; they
          are the agentic capabilities your project runs on.
        </p>
      </Section>

      <Section>
        <div className="learn-callout">
          <h2>Skills are work, not examples</h2>
          <p>
            A skill is not a tutorial snippet or a copy-paste template. It is a{" "}
            <strong>live capability</strong> the agent activates when a task matches — like an auditor that checks
            your files before publish, or an onboarding guide that walks new users through setup. You author the
            work once; the agent performs it whenever needed.
          </p>
        </div>
      </Section>

      <Section>
        <h2 className="section-heading">How it works</h2>
        <ol className="learn-steps">
          {steps.map((step) => (
            <li key={step.num} className="learn-step">
              <span className="learn-step-num" aria-hidden="true">
                {step.num}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="demo">
        <h2 className="section-heading">Demo: what create-skills-house builds</h2>
        <p className="section-intro">
          One command scaffolds a complete agentic skill project. Here is the folder structure you get — with
          plain-language labels for each part.
        </p>
        <pre className="hero-code learn-demo-command">
          <code>npx create-skills-house my-app</code>
        </pre>

        <div className="scaffold-demo">
          <div className="scaffold-demo-header">
            <span>Project structure</span>
            <span className="scaffold-demo-badge">Generated by scaffold</span>
          </div>
          <ul className="scaffold-tree" aria-label="Scaffolded project structure">
            {scaffoldTree.map((item) => (
              <li
                key={item.path}
                className={`scaffold-tree-item${item.highlight ? ` scaffold-tree-${item.highlight}` : ""}`}
                style={{ paddingLeft: `${1 + item.indent * 1.25}rem` }}
              >
                <code className="scaffold-tree-path">{item.path}</code>
                <span className="scaffold-tree-label">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="learn-starter-skill">
          <h3>Starter skill included</h3>
          <p>
            Every scaffold ships with a ready-to-edit skill in <code>skills/my-app-skill/SKILL.md</code>. Open it
            in any text editor and describe what your agent should do. The build pipeline handles the technical
            packaging.
          </p>
          <pre className="learn-code-sample">
            <code>{`---
name: my-app-skill
description: What this skill does — agents read this to decide when to use it.
---

# My App Skill

- Step one the agent should follow
- Step two with your domain rules
- Link to reference docs the agent can read on demand`}</code>
          </pre>
        </div>

        <div className="learn-next-commands">
          <h3>After scaffolding</h3>
          <div className="command-cards">
            <div className="command-card">
              <pre>
                <code>cd my-app && pnpm build</code>
              </pre>
              <p>Compiles your skill instructions into agent-ready format.</p>
            </div>
            <div className="command-card">
              <pre>
                <code>pnpm dev</code>
              </pre>
              <p>Builds and installs skills so your agent can use them right away.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="section-heading">Glossary</h2>
        <dl className="learn-glossary">
          {glossary.map((item) => (
            <div key={item.term} className="learn-glossary-item">
              <dt>{item.term}</dt>
              <dd>{item.def}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="cta-section">
        <div className="cta-panel">
          <div className="cta-panel-copy">
            <h2>Ready to scaffold your first project?</h2>
            <p>
              Start with the framework overview for the full pipeline, or jump straight to the reference skill to
              see agentic work in action.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/platform" className="btn btn-primary">
              Framework overview
            </Link>
            <Link to="/skills/skill-auditor" className="btn btn-secondary">
              See a live skill
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
