import fs from "node:fs/promises";
import path from "node:path";
import { getRepoSlug } from "@skills-house/build";
import { findRepoRoot, scanScripts, scanSkills } from "./scan.js";
import { loadSkillSchema, validateRegistry, hasValidationErrors, formatValidationIssues } from "./validate.js";
import { writeGeneratedJson } from "./generate-website.js";
import type { Registry } from "./types.js";

type PackageJson = { author?: string };

export type GenerateOptions = {
  repoRoot?: string;
  skipValidation?: boolean;
  websiteOnly?: boolean;
};

export async function generateRegistry(options: GenerateOptions = {}): Promise<Registry> {
  const repoRoot = options.repoRoot ?? (await findRepoRoot());
  const rootPkg = JSON.parse(await fs.readFile(path.join(repoRoot, "package.json"), "utf-8")) as PackageJson;
  const authorDefault = typeof rootPkg.author === "string" ? rootPkg.author.split("<")[0].trim() : "al4f";

  const repoSlug = await getRepoSlug(repoRoot);
  const skills = await scanSkills(repoRoot, authorDefault, repoSlug);
  const scripts = await scanScripts(repoRoot, skills, authorDefault);

  const registry: Registry = {
    generatedAt: new Date().toISOString(),
    repository: `https://github.com/${repoSlug}`,
    skills,
    scripts,
  };

  if (!options.skipValidation) {
    const schema = await loadSkillSchema(repoRoot);
    const issues = await validateRegistry(repoRoot, skills, scripts, schema);
    const formatted = formatValidationIssues(issues);
    console.log(formatted);
    if (hasValidationErrors(issues)) {
      throw new Error("Registry validation failed.");
    }
  }

  await writeGeneratedJson(repoRoot, registry);

  return registry;
}
