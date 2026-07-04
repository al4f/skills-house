import { Link, useParams } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Badge, Tag } from "@/components/ui";
import { getSkill } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const skill = id ? getSkill(id) : undefined;

  if (!skill) {
    return (
      <Layout active="skills">
        <Section className="page-header">
          <h1>Skill not found</h1>
          <p>
            <Link to="/platform">← Back to framework</Link>
          </p>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout active="skills" className="page-skill-detail">
      <PageMeta title={skill.name} description={skill.description} path={`/skills/${skill.id}`} />

      <nav className="breadcrumb">
        <Link to="/platform">Framework</Link>
        <span aria-hidden="true"> / </span>
        <span>{skill.name}</span>
      </nav>

      <article className="skill-detail">
        <header className="skill-detail-header">
          <p className="landing-eyebrow">Example skill</p>
          <h1 className="skill-detail-title">{skill.name}</h1>
          <p className="skill-detail-lead">{skill.description}</p>
          <div className="meta-row">
            <span className="skill-detail-author">
              By <a href={BRAND.authorUrl}>{skill.author}</a>
            </span>
            <Badge>v{skill.version}</Badge>
            {skill.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </header>

        <Section>
          <div className="skill-detail-panel">
            <h2>Install</h2>
            <p className="skill-detail-panel-desc">
              Primary path: install from GitHub via the official skills.sh CLI.
            </p>
            <CodeSnippet code={skill.installCommand} label="Consumer install" />
          </div>
        </Section>

        {skill.scripts.length > 0 && (
          <Section>
            <div className="skill-detail-panel">
              <h2>Scripts used</h2>
              <ul className="skill-detail-list">
                {skill.scripts.map((s) => {
                  const label = s.label || `${s.package}/${s.export}`;
                  return (
                    <li key={`${s.package}-${s.export}`}>
                      <span className="skill-detail-list-label">{label}</span>
                      <code>
                        {s.package}/{s.export}
                      </code>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Section>
        )}

        {skill.dependencies.length > 0 && (
          <Section>
            <div className="skill-detail-panel">
              <h2>Related skills</h2>
              <ul className="skill-detail-links">
                {skill.dependencies.map((dep) => (
                  <li key={dep}>
                    <Link to={`/skills/${dep}`}>{dep}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {skill.references.length > 0 && (
          <Section>
            <div className="skill-detail-panel">
              <h2>References</h2>
              <ul className="skill-detail-list">
                {skill.references.map((ref) => (
                  <li key={ref}>
                    <code>{ref}</code>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {skill.examples.length > 0 && (
          <Section>
            <div className="skill-detail-panel">
              <h2>Examples</h2>
              {skill.examples.map((example, i) => (
                <pre key={i}>
                  <code>{example}</code>
                </pre>
              ))}
            </div>
          </Section>
        )}

        <Section>
          <div className="landing-cta-card landing-cta-card-compact">
            <h2>Source on GitHub</h2>
            <p>Study the full skill package — authoring patterns, references, and shared scripts.</p>
            <div className="landing-cta-links">
              <a
                href={`${BRAND.repo}/tree/main/${skill.path}`}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                View source
              </a>
              <Link to="/platform" className="btn btn-ghost">
                Framework docs
              </Link>
            </div>
          </div>
        </Section>
      </article>
    </Layout>
  );
}
