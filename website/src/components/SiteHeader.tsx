import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "@/lib/types";

const navItems = [
  { href: "/platform", label: "Framework", key: "platform" },
  { href: "/learn", label: "Learn", key: "learn" },
  { href: "/skills/skill-auditor", label: "Skills", key: "skills" },
  { href: "/writing", label: "Writing", key: "writing" },
];

type SiteHeaderProps = {
  active?: string;
  variant?: "default" | "landing";
};

export function SiteHeader({ active, variant = "default" }: SiteHeaderProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const current =
    active ??
    (location.pathname.startsWith("/skills") ? "skills" : undefined) ??
    navItems.find((item) => location.pathname.startsWith(item.href))?.key ??
    (location.pathname === "/" ? "home" : undefined);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (variant !== "landing") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <header className={`site-header${variant === "landing" ? " site-header-landing" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className={variant === "landing" ? "landing-container site-header-inner" : "site-header-inner"}>
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
        <div className="site-header-actions">
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
          {variant === "landing" ? (
            <Link to="/learn" className="btn btn-primary btn-sm site-header-cta">
              Get started
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
