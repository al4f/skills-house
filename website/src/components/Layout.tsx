import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type LayoutProps = {
  children: ReactNode;
  active?: string;
  className?: string;
};

export function Layout({ children, active, className = "" }: LayoutProps) {
  return (
    <div className={`page ${className}`.trim()}>
      <div className="page-glow" aria-hidden="true" />
      <SiteHeader active={active} />
      <main className="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
