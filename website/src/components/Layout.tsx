import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

type LayoutProps = {
  children: ReactNode;
  active?: string;
  className?: string;
  variant?: "default" | "landing";
};

export function Layout({ children, active, className = "", variant = "default" }: LayoutProps) {
  return (
    <div className={`page page-${variant} ${className}`.trim()}>
      {variant !== "landing" ? <div className="page-glow" aria-hidden="true" /> : null}
      <SiteHeader active={active} variant={variant} />
      <main className={variant === "landing" ? "landing-main" : "main-content"}>{children}</main>
      <SiteFooter variant={variant} />
    </div>
  );
}
