import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function npmPackageForSkill(name: string): string {
  return `@skills-house/skill-${name}`;
}

/**
 * npm skill packages ship a flat layout (SKILL.md at package root).
 * install-skills.sh expects skills-dist/<name>/SKILL.md — restructure when needed.
 */
export function layoutDistFromNpmPackage(
  packageDir: string,
  skillName: string,
  workDir: string,
): string | null {
  if (existsSync(join(packageDir, skillName, "SKILL.md"))) {
    return packageDir;
  }

  if (!existsSync(join(packageDir, "SKILL.md"))) {
    return null;
  }

  const distDir = join(workDir, "dist");
  const skillDir = join(distDir, skillName);
  mkdirSync(skillDir, { recursive: true });
  cpSync(packageDir, skillDir, { recursive: true });
  return distDir;
}
