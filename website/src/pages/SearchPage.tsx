import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RegistrySearch } from "@/components/RegistrySearch";
import { PageMeta, Section, Badge } from "@/components/ui";
import { searchIndex } from "@/lib/registry";
import { filterSearchIndex, groupSearchResults } from "@/lib/search";

const groupLabels: Record<string, string> = {
  skill: "Skills",
  script: "Scripts",
  tag: "Tags",
  author: "Authors",
};

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(() => filterSearchIndex(searchIndex, query), [query]);
  const grouped = useMemo(() => groupSearchResults(results), [results]);

  const handleQueryChange = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        navigate("/search");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return (
    <Layout active="search">
      <PageMeta title="Search" description="Search reference monorepo metadata (maintainer view)" path="/search" />

      <Section className="page-header">
        <h1>Search</h1>
        <p>Search skills, scripts, tags, and authors in this reference monorepo — internal metadata, not a public catalog.</p>
      </Section>

      <RegistrySearch
        variant="page"
        initialQuery={query}
        onQueryChange={handleQueryChange}
        autoFocus
        showResults={false}
      />

      <div className="search-results">
        {!query.trim() ? (
          <div className="empty-state">
            <strong>Start typing to search</strong>
            <p>Try a skill name, tag like “validation”, or an author.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <strong>No results for “{query}”</strong>
            <p>
              Browse <Link to="/skills">skills</Link> or <Link to="/scripts">scripts</Link> directly.
            </p>
          </div>
        ) : (
          (["skill", "script", "tag", "author"] as const).map((type) => {
            const items = grouped[type];
            if (!items.length) return null;
            return (
              <div key={type} className="search-results-group">
                <h2>{groupLabels[type]}</h2>
                {items.map((item) => (
                  <article key={`${item.type}-${item.id}`} className="search-hit">
                    <Badge>{item.type}</Badge>{" "}
                    <Link to={`/${item.url.replace(/\/$/, "")}`}>
                      <strong>{item.title}</strong>
                    </Link>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
