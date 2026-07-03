import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { filterSearchIndex } from "@/lib/search";
import { searchIndex } from "@/lib/registry";
import type { SearchEntry } from "@/lib/types";

type RegistrySearchProps = {
  variant?: "header" | "page" | "inline";
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  showResults?: boolean;
  onQueryChange?: (query: string) => void;
};

function SearchIcon() {
  return (
    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResultLink({ item }: { item: SearchEntry }) {
  const href = `/${item.url.replace(/\/$/, "")}`;
  return (
    <Link to={href} className="search-result-item">
      <span className={`search-result-type search-result-type-${item.type}`}>{item.type}</span>
      <span className="search-result-title">{item.title}</span>
      <span className="search-result-desc">{item.description}</span>
    </Link>
  );
}

export function RegistrySearch({
  variant = "page",
  initialQuery = "",
  placeholder = "Search skills, scripts, tags…",
  autoFocus = false,
  showResults = variant !== "header",
  onQueryChange,
}: RegistrySearchProps) {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => filterSearchIndex(searchIndex, query, variant === "header" ? 6 : 40), [query, variant]);

  useEffect(() => {
    if (variant !== "header") return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [variant]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
    if (variant === "header") setOpen(Boolean(value.trim()));
  };

  return (
    <div ref={wrapRef} className={`registry-search registry-search-${variant}`}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => handleChange(event.target.value)}
            onFocus={() => variant === "header" && query.trim() && setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Search registry"
            autoFocus={autoFocus}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                handleChange("");
                setOpen(false);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {variant === "page" && (
          <p className="search-hint">
            Press <kbd>Enter</kbd> to open full results · filter as you type
          </p>
        )}
      </form>

      {showResults && variant === "header" && open && query.trim() && (
        <div className="search-dropdown" role="listbox">
          {results.length === 0 ? (
            <p className="search-dropdown-empty">No matches for “{query.trim()}”</p>
          ) : (
            <>
              {results.map((item) => (
                <ResultLink key={`${item.type}-${item.id}`} item={item} />
              ))}
              <Link
                to={`/search?q=${encodeURIComponent(query.trim())}`}
                className="search-dropdown-more"
                onClick={() => setOpen(false)}
              >
                View all results →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
