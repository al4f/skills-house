import { Link } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { LayerDiagram } from "@/components/LayerDiagram";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

const commands = [
  {
    cmd: "npx create-skills-house my-app",
    desc: "Scaffold a new project with build tooling and a starter skill",
  },
  {
    cmd: "pnpm build",
    desc: "Compile all skills to spec-compliant skills-dist/",
  },
  {
    cmd: "pnpm install:skills",
    desc: "Monorepo dev only — install dist to local agent directories",
  },
  {
    cmd: "npx skills add owner/repo --skill name",
    desc: "Primary consumer install via skills.sh CLI",
  },
];

export function PlatformPage() {
  return (
    <Layout active="platform" className="page-platform">
      <PageMeta
        title="Framework overview"
        description="How skills-house works — scaffold, author, build, and ship agentic work skills. GitHub is source of truth; skills.sh is the primary consumer install path."
        path="/platform"
      />

      <PageHero
        eyebrow="Framework overview"
        title={
          <>
            GitHub is the source.
            <br />
            <span className="landing-gradient">The framework compiles and ships.</span>
          </>
        }
        lead="skills-house is not a skill catalog. Authors scaffold a project, write modular agentic work skills, and let the build pipeline produce Agent Skills–compliant dist. Consumers install from GitHub with the official skills.sh CLI."
        command="npx create-skills-house my-app"
      >
        <Link to="/learn" className="btn btn-primary">
          Learn guide
        </Link>
        <a href={BRAND.repo} className="btn btn-ghost" target="_blank" rel="noreferrer">
          Contribute on GitHub
        </a>
      </PageHero>

      <Section>
        <div className="landing-section-header">
          <p className="landing-eyebrow">Architecture</p>
          <h2 className="landing-section-title">The layer in your stack</h2>
          <p className="landing-section-desc">
            Source authoring stays freeform. The framework handles composition, validation, and delivery to agent
            runtimes.
          </p>
        </div>
        <LayerDiagram />
      </Section>

      <Section className="landing-section-subtle page-section-band">
        <div className="landing-section-header">
          <p className="landing-eyebrow">Pipeline</p>
          <h2 className="landing-section-title">Scaffold → Author → Build → Install</h2>
        </div>
        <div className="landing-bento landing-bento-commands">
          {commands.map((item) => (
            <article key={item.cmd} className="landing-bento-card landing-bento-framework">
              <CodeSnippet code={item.cmd} />
              <p className="command-card-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="feature-card feature-card-modern">
          <div className="feature-card-media">
            <img src="./assets/diagram-pipeline.svg" alt="skills-house pipeline diagram" width={720} height={240} />
          </div>
          <div className="feature-card-body">
            <h3>Freeform source, deterministic output</h3>
            <p>
              Write under <code>skills/</code>, share logic via <code>scripts/</code>, compile with{" "}
              <code>@skills-house/build</code>. Only <code>@include</code> is a build marker — everything else uses
              standard markdown links.
            </p>
            <ul className="link-list">
              <li>
                <code>/references/foo.md</code> → copied to dist
              </li>
              <li>
                <code>package/export</code> → shared script package
              </li>
              <li>
                <code>other-skill</code> → skill dependency with install note
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="landing-section-header">
          <p className="landing-eyebrow">Example</p>
          <h2 className="landing-section-title">Agentic work skills on this framework</h2>
          <p className="landing-section-desc">
            Skills are live agentic capabilities — instructions the agent loads and executes when a task matches.
            This reference repo ships one skill to demonstrate the pattern.
          </p>
        </div>
        {registry.skills.length > 0 && (
          <div className="registry-grid">
            {registry.skills.map((skill) => (
              <article key={skill.id} className="registry-card registry-card-modern">
                <h3>
                  <Link to={`/skills/${skill.id}`}>{skill.name}</Link>
                </h3>
                <p>{skill.description}</p>
                <Link to={`/skills/${skill.id}`} className="btn btn-ghost btn-sm">
                  View skill →
                </Link>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <div className="landing-cta-card landing-cta-card-compact">
          <h2>Specs & resources</h2>
          <ul className="landing-resource-links">
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
        </div>
      </Section>
    </Layout>
  );
}
