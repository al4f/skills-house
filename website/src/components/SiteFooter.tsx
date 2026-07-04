import { Link } from "react-router-dom";
import { BRAND } from "@/lib/types";

type SiteFooterProps = {
  variant?: "default" | "landing";
};

export function SiteFooter({ variant = "default" }: SiteFooterProps) {
  const isLanding = variant === "landing";
  return (
    <footer className={`site-footer site-footer-modern${isLanding ? " site-footer-landing" : ""}`}>
      <div className={isLanding ? "landing-container site-footer-inner" : "site-footer-inner site-footer-inner-wide"}>
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link to="/" className="logo logo-footer">
              <span className="logo-mark" aria-hidden="true" />
              Skills House
            </Link>
            <p className="site-footer-tagline">
              The framework layer for Agent Skills — by{" "}
              <a href={BRAND.authorUrl}>{BRAND.author}</a>
            </p>
          </div>
          <div className="site-footer-columns">
            <div className="site-footer-col">
              <h4>Framework</h4>
              <Link to="/platform">Overview</Link>
              <Link to="/learn">Learn</Link>
              <Link to="/skills/skill-auditor">Example skill</Link>
            </div>
            <div className="site-footer-col">
              <h4>Resources</h4>
              <Link to="/writing">Writing</Link>
              <a href={BRAND.repo}>GitHub</a>
              <a href="./feed.xml">RSS</a>
            </div>
            <div className="site-footer-col">
              <h4>Install</h4>
              <a href="https://www.skills.sh/docs/cli">skills.sh CLI</a>
              <a
                href="https://github.com/al4f/skills-house/blob/main/content/publish/INSTALL.md"
                target="_blank"
                rel="noreferrer"
              >
                Install guide
              </a>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p className="footer-copy">© 2026 al4f · MIT License</p>
        </div>
      </div>
    </footer>
  );
}

export function WritingFooter() {
  return (
    <footer className="site-footer site-footer-compact">
      <div className="site-footer-inner">
        <p>
          © 2026 al4f · <a href="https://github.com/al4f">GitHub</a> · <Link to="/writing">Writing</Link> ·{" "}
          <a href="./feed.xml">RSS</a>
        </p>
      </div>
    </footer>
  );
}
