import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta } from "@/components/ui";
import { getWritingBody, getWritingPost } from "@/lib/writing";

export function WritingPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getWritingPost(slug) : undefined;

  if (!post || !slug) {
    return (
      <Layout active="writing">
        <h1>Article not found</h1>
        <p>
          <Link to="/writing">← Writing</Link>
        </p>
      </Layout>
    );
  }

  const body = getWritingBody(slug);

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
          <p className="writing-article-back">
            <Link to="/writing">← All writing</Link>
            {" · "}
            <Link to="/platform">Framework</Link>
          </p>
        </footer>
      </article>
    </Layout>
  );
}
