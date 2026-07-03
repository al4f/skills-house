import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const current =
    active ??
    navItems.find((item) => location.pathname.startsWith(item.href))?.key ??
    (location.pathname === "/" ? "home" : location.pathname.startsWith("/search") ? "search" : undefined);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-bar">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            Skills House
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="nav-toggle-icon" aria-hidden="true" />
          </button>
        </div>
        <nav id="site-nav" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main">
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
