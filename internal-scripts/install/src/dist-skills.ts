import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type ListDistSkillsOptions = {
  filter?: string;
  includeAll?: boolean;
};

export function isGlobPattern(filter: string): boolean {
  return filter.includes("*") || filter.includes("?");
}

export function skillMatchesFilter(name: string, filter: string): boolean {
  if (!filter) return true;
  if (isGlobPattern(filter)) {
    const regex = new RegExp(
      `^${filter.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`,
    );
    return regex.test(name);
  }
  return name === filter;
}

export function listDistSkills(
  distDir: string,
  options: ListDistSkillsOptions = {},
): string[] {
  if (!existsSync(distDir)) {
    return [];
  }

  const names: string[] = [];
  for (const entry of readdirSync(distDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (!existsSync(join(distDir, name, "SKILL.md"))) continue;
    if (!options.includeAll && name === "minimal-skill") continue;
    if (options.filter && !skillMatchesFilter(name, options.filter)) continue;
    names.push(name);
  }

  return names.sort();
}
