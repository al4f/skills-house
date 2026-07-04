import fs from "node:fs/promises";
import path from "node:path";
import { classifyHref, parseSkillMd } from "@skills-house/build";
import type { ScriptEntry, ScriptExport, ScriptRef, SkillEntry } from "./types.js";

type PackageJson = {
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  exports?: Record<string, string>;
  maintainers?: string[];
  "skills-house"?: {
    description?: string;
    inputs?: string[];
    outputs?: string[];
    examples?: string[];
    maintainers?: string[];
  };
};

export async function findRepoRoot(start = process.cwd()): Promise<string> {
  let dir = start;
  for (;;) {
    const pkg = path.join(dir, "package.json");
    const skills = path.join(dir, "skills");
    try {
      await fs.access(pkg);
      await fs.access(skills);
      return dir;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) throw new Error("Could not find repo root");
      dir = parent;
    }
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function defaultAuthor(rootPkg: PackageJson): string {
  if (typeof rootPkg.author === "string") {
    return rootPkg.author.split("<")[0].trim();
  }
  return "al4f";
}

function extractExamples(body: string): string[] {
  const blocks: string[] = [];
  const re = /```(?:bash|sh|shell)?\n([\s\S]*?)```/g;
  for (const match of body.matchAll(re)) {
    const snippet = match[1].trim();
    if (snippet) blocks.push(snippet);
  }
  return blocks.slice(0, 3);
}

function metadataField<T>(frontmatter: Record<string, unknown>, key: string, fallback: T): T {
  const metadata = frontmatter.metadata;
  if (metadata && typeof metadata === "object" && key in metadata) {
    return (metadata as Record<string, unknown>)[key] as T;
  }
  return fallback;
}

async function packageExists(repoRoot: string, pkg: string): Promise<"skills" | "scripts" | null> {
  for (const workspace of ["skills", "scripts"] as const) {
    try {
      await fs.access(path.join(repoRoot, workspace, pkg, "package.json"));
      return workspace;
    } catch {
      // continue
    }
  }
  return null;
}

export async function scanSkills(
  repoRoot: string,
  authorDefault: string,
  repoSlug = "owner/repo",
): Promise<SkillEntry[]> {
  const skillsDir = path.join(repoRoot, "skills");
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  const skills: SkillEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillDir = path.join(skillsDir, entry.name);
    const skillMdPath = path.join(skillDir, "SKILL.md");
    const pkgPath = path.join(skillDir, "package.json");

    const content = await fs.readFile(skillMdPath, "utf-8");
    const parsed = parseSkillMd(content);
    const pkg = await readJson<PackageJson>(pkgPath).catch(() => ({} as PackageJson));

    const scripts: ScriptRef[] = [];
    const dependencies: string[] = [];

    for (const link of parsed.links) {
      const classified = classifyHref(link.href);
      if (classified.type === "file") continue;
      const workspace = await packageExists(repoRoot, classified.pkg);
      if (workspace === "scripts") {
        scripts.push({
          package: classified.pkg,
          export: classified.export.replace(/^\.\//, ""),
          label: link.label,
        });
      } else if (workspace === "skills" && classified.pkg !== entry.name) {
        if (!dependencies.includes(classified.pkg)) dependencies.push(classified.pkg);
      }
    }

    const tags = metadataField<string[]>(parsed.frontmatter, "tags", []);
    const author = metadataField<string>(parsed.frontmatter, "author", authorDefault);
    const version =
      metadataField<string>(parsed.frontmatter, "version", "") ||
      pkg.version ||
      "0.0.0";

    const sections = parsed.includes.map((inc) => inc.replace(/^\//, ""));
    const references = parsed.links
      .filter((l) => l.href.startsWith("/"))
      .map((l) => l.href.replace(/^\//, ""));

    skills.push({
      id: entry.name,
      name: entry.name,
      description: String(parsed.frontmatter.description ?? "").trim(),
      author,
      tags: Array.isArray(tags) ? tags.map(String) : [],
      version,
      installCommand: `npx skills add ${repoSlug} --skill ${entry.name}`,
      scripts,
      dependencies,
      relatedSkills: dependencies,
      examples: extractExamples(parsed.body),
      sections,
      references,
      path: `skills/${entry.name}`,
      url: `skills/${entry.name}/`,
    });
  }

  return skills.sort((a, b) => a.id.localeCompare(b.id));
}

function parseExports(pkg: PackageJson, scriptDir: string): ScriptExport[] {
  const exports = pkg.exports ?? {};
  return Object.entries(exports).map(([key, target]) => ({
    key: key === "." ? "default" : key.replace(/^\.\//, ""),
    path: target,
    description: path.basename(target),
  }));
}

export async function scanScripts(
  repoRoot: string,
  skills: SkillEntry[],
  authorDefault: string,
): Promise<ScriptEntry[]> {
  const scriptsDir = path.join(repoRoot, "scripts");
  const entries = await fs.readdir(scriptsDir, { withFileTypes: true });
  const scripts: ScriptEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const scriptDir = path.join(scriptsDir, entry.name);
    const pkgPath = path.join(scriptDir, "package.json");
    try {
      await fs.access(pkgPath);
    } catch {
      continue;
    }

    const pkg = await readJson<PackageJson>(pkgPath);
    const meta = pkg["skills-house"] ?? {};
    const skillsUsing = skills
      .filter((s) => s.scripts.some((r) => r.package === entry.name))
      .map((s) => s.id);

    scripts.push({
      id: entry.name,
      name: entry.name,
      description: meta.description ?? pkg.description ?? `Shared script package: ${entry.name}`,
      inputs: meta.inputs ?? [],
      outputs: meta.outputs ?? [],
      exports: parseExports(pkg, scriptDir),
      skillsUsing,
      maintainers: meta.maintainers ?? pkg.maintainers ?? [authorDefault],
      examples: meta.examples ?? [],
      path: `scripts/${entry.name}`,
      url: `scripts/${entry.name}/`,
    });
  }

  return scripts.sort((a, b) => a.id.localeCompare(b.id));
}

export function buildDependencyGraph(skills: SkillEntry[]): {
  skillsToScripts: Record<string, string[]>;
  scriptsToSkills: Record<string, string[]>;
  skillsToSkills: Record<string, string[]>;
} {
  const skillsToScripts: Record<string, string[]> = {};
  const scriptsToSkills: Record<string, string[]> = {};
  const skillsToSkills: Record<string, string[]> = {};

  for (const skill of skills) {
    skillsToScripts[skill.id] = [...new Set(skill.scripts.map((s) => s.package))];
    skillsToSkills[skill.id] = [...skill.dependencies];

    for (const script of skill.scripts) {
      if (!scriptsToSkills[script.package]) scriptsToSkills[script.package] = [];
      if (!scriptsToSkills[script.package].includes(skill.id)) {
        scriptsToSkills[script.package].push(skill.id);
      }
    }
  }

  return { skillsToScripts, scriptsToSkills, skillsToSkills };
}
