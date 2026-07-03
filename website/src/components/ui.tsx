import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
};

export function PageMeta({ title, description, path = "", ogImage = "assets/og-card.svg" }: PageMetaProps) {
  const fullTitle = title.includes("al4f") || title.includes("Skills House") ? title : `${title} — Skills House by al4f`;
  const url = `https://al4f.dev/${path.replace(/^\//, "")}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`https://al4f.dev/${ogImage}`} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section className={`section ${className}`.trim()} id={id}>
      {children}
    </section>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

export function Tag({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    return (
      <a className="tag" href={href}>
        {children}
      </a>
    );
  }
  return <span className="tag">{children}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`card ${className}`.trim()}>{children}</article>;
}
