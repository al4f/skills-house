import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import {
  findLinks,
  parseSkillMd,
} from "./parse-skill-md.js";
import { resolveIncludes } from "./resolve-includes.js";
import { resolveFileLinks } from "./resolve-file-links.js";
import { resolvePackageLinks } from "./resolve-package-link.js";
import { validateSkillName } from "./validate-skill-name.js";

export type BuildSkillOptions = {
  skillDir: string;
  outDir: string;
  repoRoot: string;
};

export function skillNameFrom(
  frontmatter: Record<string, unknown>,
  skillDir: string,
): string {
  return validateSkillName(frontmatter, skillDir);
}

export async function buildSkill(options: BuildSkillOptions): Promise<void> {
  const { skillDir, outDir, repoRoot } = options;
  const skillMdPath = path.join(skillDir, "SKILL.md");
  const raw = await fs.readFile(skillMdPath, "utf-8");
  const parsed = parseSkillMd(raw);

  validateSkillName(parsed.frontmatter, skillDir);

  let body = await resolveIncludes(parsed.body, skillDir);
  const links = findLinks(body);
  const dependencies: string[] = [];

  body = await resolveFileLinks(body, links, skillDir, outDir);
  body = await resolvePackageLinks(body, links, repoRoot, outDir, dependencies);

  const frontmatter = { ...parsed.frontmatter };
  if (dependencies.length > 0) {
    const metadata =
      (frontmatter.metadata as Record<string, unknown> | undefined) ?? {};
    const existing = Array.isArray(metadata.dependencies)
      ? (metadata.dependencies as string[])
      : [];
    frontmatter.metadata = {
      ...metadata,
      dependencies: [...new Set([...existing, ...dependencies])],
    };
  }

  await fs.mkdir(outDir, { recursive: true });
  const output = `---\n${YAML.stringify(frontmatter).trimEnd()}\n---\n${body}`;
  await fs.writeFile(path.join(outDir, "SKILL.md"), output);
}
