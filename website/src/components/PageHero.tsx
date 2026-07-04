import type { ReactNode } from "react";
import { CodeSnippet } from "./CodeSnippet";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  command?: string;
  children?: ReactNode;
};

/** Compact page hero matching the landing design system */
export function PageHero({ eyebrow, title, lead, command, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <p className="landing-eyebrow">{eyebrow}</p>
      <h1 className="page-hero-title">{title}</h1>
      <p className="page-hero-lead">{lead}</p>
      {command ? <CodeSnippet code={command} /> : null}
      {children ? <div className="page-hero-actions">{children}</div> : null}
    </section>
  );
}
