import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { PageMeta, Section } from "@/components/ui";
import { writingPosts } from "@/lib/writing";

export function WritingIndexPage() {
  return (
    <Layout active="writing" className="page-writing">
      <PageMeta
        title="Writing — al4f.dev"
        description="Technical articles on Agent Skills engineering by al4f."
        path="/writing"
      />

      <PageHero
        eyebrow="Writing"
        title={
          <>
            Architecture notes & <span className="landing-gradient">build logs</span>
          </>
        }
        lead="Deep dives on Agent Skills infrastructure — scaling authoring, distribution models, and lessons from building skills-house."
      />

      <Section>
        <div className="writing-grid">
          {writingPosts.map((post) => (
            <Link key={post.slug} to={`/writing/${post.slug}`} className="writing-card">
              {post.eyebrow ? <span className="writing-card-eyebrow">{post.eyebrow}</span> : null}
              <h2 className="writing-card-title">{post.title}</h2>
              <p className="writing-card-desc">{post.description}</p>
              <span className="writing-card-meta">
                {post.date} · {post.readTime}
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
