import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { getScript } from "@/lib/registry";
import { BRAND } from "@/lib/types";

export function ScriptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const script = id ? getScript(id) : undefined;

  if (!script) {
    return (
      <Layout active="scripts">
        <Section className="page-header">
          <h1>Script not found</h1>
          <p>
            <Link to="/scripts">← Back to scripts</Link>
          </p>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout active="scripts">
      <PageMeta title={script.name} description={script.description} path={`/scripts/${script.id}`} />

      <nav className="breadcrumb">
        <Link to="/scripts">Scripts</Link> / {script.name}
      </nav>

      <article className="detail-page">
        <header className="detail-header">
          <h1>{script.name}</h1>
          <p className="lead">{script.description}</p>
          <div className="meta-row">
            <span>Maintainers: {script.maintainers.join(", ")}</span>
          </div>
        </header>

        <Section>
          <h2>Exports</h2>
          <div className="table-wrap">
            <table className="registry-table">
              <thead>
                <tr>
                  <th>Export</th>
                  <th>Path</th>
                </tr>
              </thead>
              <tbody>
                {script.exports.map((exp) => (
                  <tr key={exp.key}>
                    <td>
                      <code>{exp.key}</code>
                    </td>
                    <td>
                      <code>{exp.path}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {script.inputs.length > 0 && (
          <Section>
            <h2>Inputs</h2>
            <ul className="link-list">
              {script.inputs.map((input) => (
                <li key={input}>{input}</li>
              ))}
            </ul>
          </Section>
        )}

        {script.outputs.length > 0 && (
          <Section>
            <h2>Outputs</h2>
            <ul className="link-list">
              {script.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
          </Section>
        )}

        {script.skillsUsing.length > 0 && (
          <Section>
            <h2>Skills using this script</h2>
            <ul className="link-list">
              {script.skillsUsing.map((skillId) => (
                <li key={skillId}>
                  <Link to={`/skills/${skillId}`}>{skillId}</Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {script.examples.length > 0 && (
          <Section>
            <h2>Examples</h2>
            {script.examples.map((example, i) => (
              <pre key={i}>
                <code>{example}</code>
              </pre>
            ))}
          </Section>
        )}

        <Section>
          <h2>Source</h2>
          <p>
            <a href={`${BRAND.repo}/tree/main/${script.path}`}>View on GitHub</a>
          </p>
        </Section>
      </article>
    </Layout>
  );
}
