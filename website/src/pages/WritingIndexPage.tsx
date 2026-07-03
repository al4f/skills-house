import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { writingPosts } from "@/lib/writing";

export function WritingIndexPage() {
  return (
    <Layout active="writing">
      <PageMeta
        title="Writing — al4f.dev"
        description="Technical articles on Agent Skills engineering by al4f."
        path="/writing"
      />

      <Section className="page-header">
        <h1>Writing</h1>
        <p>Architecture notes, authoring patterns, and build logs on Agent Skills infrastructure.</p>
      </Section>

      <ul className="post-list post-list-large">
        {writingPosts.map((post) => (
          <li key={post.slug}>
            <Link to={`/writing/${post.slug}`} className="post-item">
              <div>
                {post.eyebrow && <span className="post-eyebrow">{post.eyebrow}</span>}
                <span className="post-title">{post.title}</span>
              </div>
              <span className="post-date">{post.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
