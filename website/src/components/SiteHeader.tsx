import { Link, useLocation } from "react-router-dom";
import { RegistrySearch } from "@/components/RegistrySearch";
import { BRAND } from "@/lib/types";

const navItems = [
  { href: "/platform", label: "Overview", key: "platform" },
  { href: "/skills", label: "Skills", key: "skills" },
  { href: "/scripts", label: "Scripts", key: "scripts" },
  { href: "/graph", label: "Graph", key: "graph" },
  { href: "/search", label: "Search", key: "search" },
  { href: "/writing", label: "Writing", key: "writing" },
];

type SiteHeaderProps = {
  active?: string;
};

export function SiteHeader({ active }: SiteHeaderProps) {
  const location = useLocation();
  const current =
    active ??
    navItems.find((item) => location.pathname.startsWith(item.href))?.key ??
    (location.pathname === "/" ? "home" : location.pathname.startsWith("/search") ? "search" : undefined);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          Skills House
        </Link>
        <nav className="site-nav" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={current === item.key ? "active" : undefined}
              aria-current={current === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a href={BRAND.repo} className="nav-external" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <div className="site-header-actions">
          <RegistrySearch variant="header" placeholder="Search registry…" />
        </div>
      </div>
    </header>
  );
}
