import { Link } from "react-router-dom";
import { InlineFilter } from "@/components/InlineFilter";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Tag } from "@/components/ui";
import { registry } from "@/lib/registry";
import type { SkillEntry } from "@/lib/types";

function filterSkill(skill: SkillEntry, query: string): boolean {
  return (
    skill.name.toLowerCase().includes(query) ||
    skill.description.toLowerCase().includes(query) ||
    skill.author.toLowerCase().includes(query) ||
    skill.tags.some((tag) => tag.toLowerCase().includes(query))
  );
}

export function SkillsIndexPage() {
  return (
    <Layout active="skills">
      <PageMeta title="Skills Explorer" description="Browse all AI Skills in Skills House" path="/skills" />

      <Section className="page-header">
        <h1>Skills Explorer</h1>
        <p>Every skill in the Skills House registry, generated from repository metadata.</p>
      </Section>

      <InlineFilter
        items={registry.skills}
        placeholder="Filter by name, tag, author…"
        filterFn={filterSkill}
      >
        {(filtered, query) =>
          filtered.length === 0 ? (
            <div className="empty-state">
              <strong>{query ? `No skills match “${query}”` : "No skills published yet"}</strong>
              <p>
                {query ? (
                  <>
                    Try <Link to="/search">global search</Link> or clear the filter.
                  </>
                ) : (
                  "Skills appear here after they are merged into the repository."
                )}
              </p>
            </div>
          ) : (
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
                  {filtered.map((skill) => (
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
          )
        }
      </InlineFilter>
    </Layout>
  );
}
