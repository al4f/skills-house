import { Link } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";
import { BRAND } from "@/lib/types";

const commands = [
  { cmd: "npx @skills-house/create my-app", desc: "Scaffold a new project" },
  { cmd: "pnpm build", desc: "Compile skills to skills-dist/" },
  { cmd: "npx skills add owner/repo --skill name", desc: "Install a skill (consumer)" },
  { cmd: "pnpm install:skills", desc: "Install dist locally (monorepo dev)" },
];

export function PlatformPage() {
  return (
    <Layout active="platform" className="page-platform">
      <PageMeta
        title="Framework overview"
        description="Scaffold, author, build, and ship Agent Skills."
        path="/platform"
      />

      <PageHero
        eyebrow="Framework"
        title="Source → build → install"
        lead="Not a skill catalog. Fork the framework, author your own skills, ship from your repo."
        command="npx @skills-house/create my-app"
      >
        <Link to="/learn" className="btn btn-primary">
          Getting started
        </Link>
        <a href={BRAND.repo} className="btn btn-ghost" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </PageHero>

      <Section>
        <h2 className="section-heading">Commands</h2>
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
            <img src="./assets/diagram-pipeline.svg" alt="skills-house pipeline" width={720} height={240} />
          </div>
          <div className="feature-card-body">
            <h3>Authoring</h3>
            <p>
              Only <code>SKILL.md</code> is required. Use <code>@include</code> for fragments and markdown links
              for references (<code>/references/foo.md</code>), scripts (<code>package/export</code>), and skill
              dependencies.
            </p>
            <ul className="link-list">
              <li>
                <a href={`${BRAND.repo}/tree/main/specs`} target="_blank" rel="noreferrer">
                  Architecture specs
                </a>
              </li>
              <li>
                <a href={`${BRAND.repo}/blob/main/content/publish/INSTALL.md`} target="_blank" rel="noreferrer">
                  Install guide
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {registry.skills.length > 0 && (
        <Section>
          <h2 className="section-heading">Example skill</h2>
          {registry.skills.map((skill) => (
            <article key={skill.id} className="registry-card registry-card-modern">
              <h3>
                <Link to={`/skills/${skill.id}`}>{skill.name}</Link>
              </h3>
              <p>{skill.description}</p>
            </article>
          ))}
        </Section>
      )}
    </Layout>
  );
}
