import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";

export function SkillsIndexPage() {
  return (
    <Layout active="skills">
      <PageMeta title="Skills Explorer" description="Browse all AI Skills in Skills House" path="/skills" />

      <Section className="page-header">
        <h1>Skills Explorer</h1>
        <p>Every skill in the Skills House registry, generated from repository metadata.</p>
      </Section>

      <div className="table-wrap">
        <table className="registry-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Description</th>
              <th>Author</th>
              <th>Tags</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {registry.skills.map((skill) => (
              <tr key={skill.id}>
                <td>
                  <Link to={`/skills/${skill.id}`}>{skill.name}</Link>
                </td>
                <td className="desc-cell">
                  {skill.description.slice(0, 120)}
                  {skill.description.length > 120 ? "…" : ""}
                </td>
                <td>{skill.author}</td>
                <td>
                  <div className="tag-row">
                    {skill.tags.map((tag) => (
                      <Tag key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </td>
                <td>
                  <code>v{skill.version}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
