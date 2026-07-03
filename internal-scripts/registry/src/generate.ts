import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import {
  buildDependencyGraph,
  findRepoRoot,
  scanScripts,
  scanSkills,
} from "./scan.js";
import { buildSearchIndex, loadSkillSchema, validateRegistry, hasValidationErrors, formatValidationIssues } from "./validate.js";
import { writeGeneratedJson, writeWebsitePages } from "./generate-website.js";
import type { Registry } from "./types.js";

type PackageJson = { author?: string };

function resolveGeneratedAt(repoRoot: string): string {
  try {
    const timestamp = execSync(
      "git log -1 --format=%cI HEAD -- skills scripts specs/schema",
      { cwd: repoRoot, encoding: "utf8" },
    ).trim();
    if (timestamp) return timestamp;
  } catch {
    // Fall through when git is unavailable.
  }
  return "1970-01-01T00:00:00.000Z";
}

export type GenerateOptions = {
  repoRoot?: string;
  skipValidation?: boolean;
  websiteOnly?: boolean;
};

export async function generateRegistry(options: GenerateOptions = {}): Promise<Registry> {
  const repoRoot = options.repoRoot ?? (await findRepoRoot());
  const rootPkg = JSON.parse(await fs.readFile(path.join(repoRoot, "package.json"), "utf-8")) as PackageJson;
  const authorDefault = typeof rootPkg.author === "string" ? rootPkg.author.split("<")[0].trim() : "al4f";

  const skills = await scanSkills(repoRoot, authorDefault);
  const scripts = await scanScripts(repoRoot, skills, authorDefault);
  const graph = buildDependencyGraph(skills);

  const partial: Omit<Registry, "searchIndex"> = {
    generatedAt: resolveGeneratedAt(repoRoot),
    repository: "https://github.com/al4f/skills-house",
    skills,
    scripts,
    graph,
  };

  const searchIndex = buildSearchIndex(partial);
  const registry: Registry = { ...partial, searchIndex };

  if (!options.skipValidation) {
    const schema = await loadSkillSchema(repoRoot);
    const issues = await validateRegistry(repoRoot, skills, scripts, schema);
    const formatted = formatValidationIssues(issues);
    console.log(formatted);
    if (hasValidationErrors(issues)) {
      throw new Error("Registry validation failed.");
    }
  }

  if (!options.websiteOnly) {
    await writeGeneratedJson(repoRoot, registry);
  }
  await writeWebsitePages(repoRoot, registry);

  return registry;
}
