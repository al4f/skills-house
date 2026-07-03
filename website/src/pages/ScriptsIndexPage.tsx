import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { registry } from "@/lib/registry";

export function ScriptsIndexPage() {
  return (
    <Layout active="scripts">
      <PageMeta
        title="Scripts Explorer"
        description="Browse shared script packages in Skills House"
        path="/scripts"
      />

      <Section className="page-header">
        <h1>Scripts Explorer</h1>
        <p>Shared execution packages referenced by skills across the ecosystem.</p>
      </Section>

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
            {registry.scripts.map((script) => (
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
    </Layout>
  );
}
