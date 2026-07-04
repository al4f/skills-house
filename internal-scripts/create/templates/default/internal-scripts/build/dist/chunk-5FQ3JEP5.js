// src/parse-skill-md.ts
import YAML from "yaml";
var INCLUDE_RE = /^@include\s+(\/[^\s]+)\s*$/gm;
var LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
function parseSkillMd(content) {
  const trimmed = content.trimStart();
  if (!trimmed.startsWith("---")) {
    return {
      frontmatter: {},
      body: content,
      includes: findIncludes(content),
      links: findLinks(content)
    };
  }
  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    throw new Error("SKILL.md: unclosed YAML frontmatter");
  }
  const yamlBlock = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\n/, "");
  const frontmatter = YAML.parse(yamlBlock) ?? {};
  return {
    frontmatter,
    body,
    includes: findIncludes(body),
    links: findLinks(body)
  };
}
function findIncludes(body) {
  return [...body.matchAll(INCLUDE_RE)].map((m) => m[1]);
}
function findLinks(body) {
  const links = [];
  for (const match of body.matchAll(LINK_RE)) {
    links.push({ label: match[1], href: match[2] });
  }
  return links;
}

// src/classify-href.ts
function classifyHref(href) {
  if (href.startsWith("/")) return { type: "file", path: href };
  const slash = href.indexOf("/");
  if (slash === -1) return { type: "package", pkg: href, export: "." };
  return {
    type: "package",
    pkg: href.slice(0, slash),
    export: "./" + href.slice(slash + 1)
  };
}

// src/get-repo-slug.ts
import fs from "fs/promises";
import path from "path";
async function getRepoSlug(repoRoot) {
  const raw = await fs.readFile(path.join(repoRoot, "package.json"), "utf-8");
  const pkg = JSON.parse(raw);
  const url = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  if (!url) {
    throw new Error(
      "Cannot resolve repo slug: root package.json has no repository URL"
    );
  }
  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  if (!match) {
    throw new Error(`Cannot parse GitHub repo slug from: ${url}`);
  }
  return match[1];
}

export {
  parseSkillMd,
  findIncludes,
  findLinks,
  classifyHref,
  getRepoSlug
};
