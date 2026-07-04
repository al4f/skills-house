import { Link, useParams } from "react-router-dom";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Layout } from "@/components/Layout";
import { PageMeta } from "@/components/ui";
import { getSkill } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const skill = id ? getSkill(id) : undefined;

  if (!skill) {
    return (
      <Layout active="skills">
        <h1>Skill not found</h1>
        <p>
          <Link to="/platform">← Framework</Link>
        </p>
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
          <h1 className="skill-detail-title">{skill.name}</h1>
          <p className="skill-detail-lead">{skill.description}</p>
        </header>

        <CodeSnippet code={skill.installCommand} label="Install" />

        <div className="landing-cta-links">
          <a
            href={`${BRAND.repo}/tree/main/${skill.path}`}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            Source on GitHub
          </a>
          <Link to="/platform" className="btn btn-ghost">
            Framework docs
          </Link>
        </div>
      </article>
    </Layout>
  );
}
