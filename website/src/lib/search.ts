import type { SearchEntry } from "./types";

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearchEntry(entry: SearchEntry, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return false;
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    (entry.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
  );
}

export function filterSearchIndex(index: SearchEntry[], query: string, limit = 40): SearchEntry[] {
  const q = normalizeQuery(query);
  if (!q) return [];
  return index.filter((entry) => matchesSearchEntry(entry, q)).slice(0, limit);
}

export function groupSearchResults(results: SearchEntry[]): Record<SearchEntry["type"], SearchEntry[]> {
  return results.reduce(
    (groups, item) => {
      groups[item.type].push(item);
      return groups;
    },
    {
      skill: [] as SearchEntry[],
      script: [] as SearchEntry[],
      tag: [] as SearchEntry[],
      author: [] as SearchEntry[],
    },
  );
}
