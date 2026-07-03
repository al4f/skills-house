import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PageMeta, Section, Badge } from "@/components/ui";
import { searchIndex } from "@/lib/registry";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 40);
  }, [query]);

  return (
    <Layout active="search">
      <PageMeta title="Search" description="Search the Skills House registry" path="/search" />

      <Section className="page-header">
        <h1>Search</h1>
        <p>Search skills, scripts, tags, and authors across the registry.</p>
      </Section>

      <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="search-input-wrap">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, scripts, tags, authors…"
            autoComplete="off"
            aria-label="Search registry"
            autoFocus
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <p className="search-hint">
          <kbd>⌘</kbd> <kbd>K</kbd> style search — type to filter instantly
        </p>
      </form>

      <div className="search-results">
        {!query.trim() ? (
          <p className="muted search-empty">Start typing to search the registry.</p>
        ) : results.length === 0 ? (
          <p className="muted">No results for "{query}".</p>
        ) : (
          results.map((item) => (
            <article key={`${item.type}-${item.id}`} className="search-hit">
              <Badge>{item.type}</Badge>
              <Link to={`/${item.url.replace(/\/$/, "")}`}>
                <strong>{item.title}</strong>
              </Link>
              <p>{item.description}</p>
            </article>
          ))
        )}
      </div>
    </Layout>
  );
}
