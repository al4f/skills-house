import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Badge, Tag } from "@/components/ui";
import { getSkill, registry } from "@/lib/registry";
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
            <Link to="/skills">← Back to skills</Link>
          </p>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout active="skills">
      <PageMeta title={skill.name} description={skill.description} path={`/skills/${skill.id}`} />

      <nav className="breadcrumb">
        <Link to="/skills">Skills</Link> / {skill.name}
      </nav>

      <article className="detail-page">
        <header className="detail-header">
          <h1>{skill.name}</h1>
          <p className="lead">{skill.description}</p>
          <div className="meta-row">
            <span>
              By{" "}
              <Link to={`/search?q=${encodeURIComponent(skill.author)}`}>{skill.author}</Link>
            </span>
            <Badge>v{skill.version}</Badge>
            {skill.tags.map((tag) => (
              <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                {tag}
              </Tag>
            ))}
          </div>
        </header>

        <Section>
          <h2>Install (consumer)</h2>
          <p>
            Primary path — official skills.sh CLI from GitHub source in any repo where agents run:
          </p>
          <pre>
            <code>{skill.installCommand}</code>
          </pre>
        </Section>

        {skill.scripts.length > 0 && (
          <Section>
            <h2>Scripts used</h2>
            <ul className="link-list">
              {skill.scripts.map((s) => {
                const script = registry.scripts.find((r) => r.id === s.package);
                const label = s.label || `${s.package}/${s.export}`;
                return (
                  <li key={`${s.package}-${s.export}`}>
                    {script ? (
                      <Link to={`/scripts/${s.package}`}>{label}</Link>
                    ) : (
                      <span>{label}</span>
                    )}{" "}
                    <code>
                      {s.package}/{s.export}
                    </code>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {skill.dependencies.length > 0 && (
          <Section>
            <h2>Related skills</h2>
            <ul className="link-list">
              {skill.dependencies.map((dep) => (
                <li key={dep}>
                  <Link to={`/skills/${dep}`}>{dep}</Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {skill.references.length > 0 && (
          <Section>
            <h2>References</h2>
            <ul className="link-list">
              {skill.references.map((ref) => (
                <li key={ref}>
                  <code>{ref}</code>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {skill.examples.length > 0 && (
          <Section>
            <h2>Examples</h2>
            {skill.examples.map((example, i) => (
              <pre key={i}>
                <code>{example}</code>
              </pre>
            ))}
          </Section>
        )}

        <Section>
          <h2>Source</h2>
          <p>
            <a href={`${BRAND.repo}/tree/main/${skill.path}`}>View on GitHub</a>
          </p>
        </Section>
      </article>
    </Layout>
  );
}
