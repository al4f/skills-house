import YAML from "yaml";

const INCLUDE_RE = /^@include\s+(\/[^\s]+)\s*$/gm;
const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;

export type SkillLink = { label: string; href: string };

export type ParsedSkillMd = {
  frontmatter: Record<string, unknown>;
  body: string;
  includes: string[];
  links: SkillLink[];
};

export function parseSkillMd(content: string): ParsedSkillMd {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) {
    return {
      frontmatter: {},
      body: content,
      includes: findIncludes(content),
      links: findLinks(content),
    };
  }

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    throw new Error("SKILL.md: unclosed YAML frontmatter");
  }

  const yamlBlock = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\n/, "");
  const frontmatter = (YAML.parse(yamlBlock) ?? {}) as Record<string, unknown>;

  return {
    frontmatter,
    body,
    includes: findIncludes(body),
    links: findLinks(body),
  };
}

export function findIncludes(body: string): string[] {
  return [...body.matchAll(INCLUDE_RE)].map((m) => m[1]);
}

export function findLinks(body: string): SkillLink[] {
  const links: SkillLink[] = [];
  for (const match of body.matchAll(LINK_RE)) {
    links.push({ label: match[1], href: match[2] });
  }
  return links;
}
