import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function PlatformPage() {
  return (
    <Layout active="platform">
      <PageMeta
        title="Framework overview"
        description="How skills-house works — scaffold, author, build, and ship agentic work skills. GitHub is source of truth; skills.sh is the primary consumer install path."
        path="/platform"
      />

      <Section className="hero hero-compact">
        <p className="eyebrow">Framework overview</p>
        <h1 className="hero-title">
          GitHub is the source. <span className="gradient-text">The framework compiles and ships.</span>
        </h1>
        <p className="lead">
          skills-house is not a skill catalog. Authors scaffold a project, write modular agentic work skills, and
          let the build pipeline produce Agent Skills–compliant dist. Consumers install from GitHub with the
          official skills.sh CLI.
        </p>
        <div className="hero-actions">
          <Link to="/learn" className="btn btn-primary">
            Learn guide
          </Link>
          <pre>
            <code>npx create-skills-house my-app</code>
          </pre>
          <a href={BRAND.repo} className="btn btn-ghost" target="_blank" rel="noreferrer">
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
            <h3>Scaffold → Author → Build → Install</h3>
            <p>
              Freeform source under <code>skills/</code>, shared scripts under <code>scripts/</code>, compile with{" "}
              <code>@skills-house/build</code>, install to agents locally for dev or publish to GitHub for consumers.
            </p>
            <ul className="feature-list">
              <li>
                <code>npx create-skills-house</code> — scaffold a new project
              </li>
              <li>
                <code>pnpm build</code> — compile skills to <code>skills-dist/</code>
              </li>
              <li>
                <code>pnpm install:skills</code> — monorepo dev only (dist → agent dirs)
              </li>
              <li>
                <code>npx skills add owner/repo --skill name</code> — primary consumer install (skills.sh)
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Agentic work skills on this framework</h2>
        <p>
          Skills in skills-house are not static examples or demo snippets. Each skill is a{" "}
          <strong>live agentic capability</strong> — instructions the agent loads and executes when a task matches.
          The reference monorepo ships one skill to demonstrate the pattern; fork the framework and add your own
          agentic work skills in your repository.
        </p>
        {registry.skills.length > 0 && (
          <div className="registry-grid">
            {registry.skills.map((skill) => (
              <article key={skill.id} className="registry-card">
                <h3>
                  <Link to={`/skills/${skill.id}`}>{skill.name}</Link>
                </h3>
                <p>{skill.description}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <h2>Specs</h2>
        <ul className="link-list">
          <li>
            <Link to="/learn">Getting started guide (plain language)</Link>
          </li>
          <li>
            <a href={`${BRAND.repo}/tree/main/specs`} target="_blank" rel="noreferrer">
              Architecture & authoring specs
            </a>
          </li>
          <li>
            <a href={`${BRAND.repo}/blob/main/content/publish/INSTALL.md`} target="_blank" rel="noreferrer">
              Consumer install guide
            </a>
          </li>
          <li>
            <Link to="/writing">Articles & build logs</Link>
          </li>
        </ul>
      </Section>
    </Layout>
  );
}
