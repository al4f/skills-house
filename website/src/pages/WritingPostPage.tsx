import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { getWritingBody, getWritingPost } from "@/lib/writing";

export function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getWritingPost(slug) : undefined;

  if (!post || !slug) {
    return (
      <Layout active="writing">
        <Section className="page-header">
          <h1>Article not found</h1>
          <p>
            <Link to="/writing">← Back to writing</Link>
          </p>
        </Section>
      </Layout>
    );
  }

  const body = getWritingBody(slug);

  return (
    <Layout active="writing">
      <PageMeta
        title={post.title}
        description={post.description}
        path={`/writing/${post.slug}`}
        ogImage={post.ogImage}
      />

      <header className="article-header">
        {post.eyebrow && <p className="eyebrow">{post.eyebrow}</p>}
        <h1>{post.title}</h1>
        <p className="article-meta">
          {post.date} · {post.readTime}
        </p>
      </header>

      <article className="article-content" dangerouslySetInnerHTML={{ __html: body }} />

      <nav className="article-nav">
        <p>
          <a href="https://github.com/al4f/skills-house">skills-house on GitHub</a> · <Link to="/writing">More writing</Link>
        </p>
      </nav>
    </Layout>
  );
}
