import { useMemo, useState, type ReactNode } from "react";

type InlineFilterProps<T> = {
  items: T[];
  placeholder?: string;
  filterFn: (item: T, query: string) => boolean;
  children: (filtered: T[], query: string) => ReactNode;
};

export function InlineFilter<T>({
  items,
  placeholder = "Filter…",
  filterFn,
  children,
}: InlineFilterProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => filterFn(item, q));
  }, [items, query, filterFn]);

  return (
    <>
      <div className="inline-filter">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Filter list"
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear filter">
            ×
          </button>
        )}
        <span className="inline-filter-count">
          {filtered.length} of {items.length}
        </span>
      </div>
      {children(filtered, query)}
    </>
  );
}
