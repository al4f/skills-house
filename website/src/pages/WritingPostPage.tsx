import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section } from "@/components/ui";
import { getWritingBody, getWritingPost, writingPosts } from "@/lib/writing";

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
  const currentIndex = writingPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex >= 0 ? writingPosts[currentIndex + 1] : undefined;

  return (
    <Layout active="writing" className="page-writing-post">
      <PageMeta
        title={post.title}
        description={post.description}
        path={`/writing/${post.slug}`}
        ogImage={post.ogImage}
      />

      <article className="writing-article">
        <header className="writing-article-header">
          {post.eyebrow ? <p className="landing-eyebrow">{post.eyebrow}</p> : null}
          <h1 className="writing-article-title">{post.title}</h1>
          <p className="writing-article-meta">
            {post.date} · {post.readTime}
          </p>
        </header>

        <div className="writing-article-body article-content" dangerouslySetInnerHTML={{ __html: body }} />

        <footer className="writing-article-footer">
          <div className="landing-cta-card landing-cta-card-compact">
            <h2>Build with skills-house</h2>
            <p>Scaffold a project and ship your first Agent Skill to any runtime.</p>
            <div className="landing-cta-links">
              <Link to="/platform" className="btn btn-primary">
                Framework overview
              </Link>
              <a href="https://github.com/al4f/skills-house" className="btn btn-ghost" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </div>
          </div>
          {nextPost ? (
            <p className="writing-article-next">
              Next: <Link to={`/writing/${nextPost.slug}`}>{nextPost.title}</Link>
            </p>
          ) : null}
          <p className="writing-article-back">
            <Link to="/writing">← All writing</Link>
          </p>
        </footer>
      </article>
    </Layout>
  );
}
