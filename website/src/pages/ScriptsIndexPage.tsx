import { Link } from "react-router-dom";
import { InlineFilter } from "@/components/InlineFilter";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";
import type { ScriptEntry } from "@/lib/types";

function filterScript(script: ScriptEntry, query: string): boolean {
  return (
    script.name.toLowerCase().includes(query) ||
    script.description.toLowerCase().includes(query) ||
    script.maintainers.some((m) => m.toLowerCase().includes(query)) ||
    script.skillsUsing.some((id) => id.toLowerCase().includes(query))
  );
}

export function ScriptsIndexPage() {
  return (
    <Layout active="scripts">
      <PageMeta
        title="Shared scripts"
        description="Script packages in the skills-house reference monorepo"
        path="/scripts"
      />

      <Section className="page-header">
        <h1>Shared scripts</h1>
        <p>Reusable execution packages referenced from skills in this reference monorepo.</p>
      </Section>

      <InlineFilter
        items={registry.scripts}
        placeholder="Filter by name, maintainer, skill…"
        filterFn={filterScript}
      >
        {(filtered, query) =>
          filtered.length === 0 ? (
            <div className="empty-state">
              <strong>{query ? `No scripts match “${query}”` : "No scripts published yet"}</strong>
              <p>{query ? "Clear the filter or try global search." : "Scripts appear as packages are added."}</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Script</th>
                    <th>Description</th>
                    <th>Skills using</th>
                    <th>Maintainers</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((script) => (
                    <tr key={script.id}>
                      <td>
                        <Link to={`/scripts/${script.id}`}>{script.name}</Link>
                      </td>
                      <td className="desc-cell">
                        {script.description.slice(0, 120)}
                        {script.description.length > 120 ? "…" : ""}
                      </td>
                      <td>
                        {script.skillsUsing.length
                          ? script.skillsUsing.map((id, i) => (
                              <span key={id}>
                                {i > 0 && ", "}
                                <Link to={`/skills/${id}`}>{id}</Link>
                              </span>
                            ))
                          : "—"}
                      </td>
                      <td>{script.maintainers.join(", ")}</td>
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
