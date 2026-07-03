import { Link } from "react-router-dom";
import { BRAND } from "@/lib/types";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>
          <strong>{BRAND.site}</strong> by <a href={BRAND.authorUrl}>{BRAND.author}</a>
        </p>
        <p className="footer-links">
          <a href={BRAND.repo}>GitHub</a>
          <span aria-hidden="true">·</span>
          <a href={BRAND.docs}>Documentation</a>
          <span aria-hidden="true">·</span>
          <a href="./feed.xml">RSS</a>
        </p>
        <p className="footer-copy">© 2026 al4f</p>
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
