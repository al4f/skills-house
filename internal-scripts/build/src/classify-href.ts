export type ClassifiedHref =
  | { type: "file"; path: string }
  | { type: "package"; pkg: string; export: string };

export function classifyHref(href: string): ClassifiedHref {
  if (href.startsWith("/")) return { type: "file", path: href };
  const slash = href.indexOf("/");
  if (slash === -1) return { type: "package", pkg: href, export: "." };
  return {
    type: "package",
    pkg: href.slice(0, slash),
    export: "./" + href.slice(slash + 1),
  };
}
