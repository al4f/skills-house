import fs from "node:fs/promises";
import path from "node:path";
import Ajv from "ajv";
import { classifyHref } from "@skills-house/build";
import type { Registry, SearchEntry } from "./types.js";
import type { SkillEntry } from "./types.js";

type ValidationIssue = {
  level: "error" | "warn";
  code: string;
  message: string;
  path?: string;
};

const SKILL_NAME_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export async function loadSkillSchema(repoRoot: string): Promise<object> {
  const schemaPath = path.join(repoRoot, "specs/schema/skill-frontmatter.schema.json");
  return JSON.parse(await fs.readFile(schemaPath, "utf-8")) as object;
}

export function buildSearchIndex(registry: Omit<Registry, "searchIndex">): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const seenTags = new Set<string>();
  const seenAuthors = new Set<string>();

  for (const skill of registry.skills) {
    entries.push({
      id: skill.id,
      type: "skill",
      title: skill.name,
      description: skill.description,
      url: skill.url,
      tags: skill.tags,
    });

    for (const tag of skill.tags) {
      if (seenTags.has(tag)) continue;
      seenTags.add(tag);
      entries.push({
        id: `tag:${tag}`,
        type: "tag",
        title: tag,
        description: `Skills tagged with ${tag}`,
        url: `search/?q=${encodeURIComponent(tag)}`,
      });
    }

    if (!seenAuthors.has(skill.author)) {
      seenAuthors.add(skill.author);
      entries.push({
        id: `author:${skill.author}`,
        type: "author",
        title: skill.author,
        description: `Skills by ${skill.author}`,
        url: `search/?q=${encodeURIComponent(skill.author)}`,
      });
    }
  }

  for (const script of registry.scripts) {
    entries.push({
      id: script.id,
      type: "script",
      title: script.name,
      description: script.description,
      url: script.url,
    });
  }

  return entries;
}

async function resolvePackageWorkspace(
  repoRoot: string,
  pkg: string,
): Promise<"skills" | "scripts" | null> {
  for (const workspace of ["scripts", "skills"] as const) {
    try {
      await fs.access(path.join(repoRoot, workspace, pkg, "package.json"));
      return workspace;
    } catch {
      // continue
    }
  }
  return null;
}

async function validateExport(
  repoRoot: string,
  pkg: string,
  exportKey: string,
): Promise<boolean> {
  const pkgPath = path.join(repoRoot, "scripts", pkg, "package.json");
  try {
    const raw = await fs.readFile(pkgPath, "utf-8");
    const pkgJson = JSON.parse(raw) as { exports?: Record<string, string> };
    return Boolean(pkgJson.exports?.[exportKey]);
  } catch {
    return false;
  }
}

export async function validateRegistry(
  repoRoot: string,
  skills: SkillEntry[],
  scripts: { id: string }[],
  schema: object,
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);

  const skillIds = new Set(skills.map((s) => s.id));
  const scriptIds = new Set(scripts.map((s) => s.id));
  const allIds = new Set<string>();

  for (const skill of skills) {
    if (allIds.has(skill.id)) {
      issues.push({
        level: "error",
        code: "duplicate-id",
        message: `Duplicate ID: ${skill.id}`,
        path: skill.path,
      });
    }
    allIds.add(skill.id);

    if (!SKILL_NAME_RE.test(skill.id) || skill.id.length > 64) {
      issues.push({
        level: "error",
        code: "invalid-name",
        message: `Invalid skill name: ${skill.id}`,
        path: skill.path,
      });
    }

    const skillMd = await fs.readFile(path.join(repoRoot, skill.path, "SKILL.md"), "utf-8");
    const fmMatch = skillMd.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const YAML = await import("yaml");
      const frontmatter = (YAML.parse(fmMatch[1]) ?? {}) as Record<string, unknown>;
      if (!validate(frontmatter)) {
        for (const err of validate.errors ?? []) {
          issues.push({
            level: "error",
            code: "schema",
            message: `Schema validation: ${err.instancePath || "/"} ${err.message}`,
            path: skill.path,
          });
        }
      }
      if (frontmatter.name !== skill.id) {
        issues.push({
          level: "error",
          code: "name-mismatch",
          message: `Frontmatter name '${String(frontmatter.name)}' does not match directory '${skill.id}'`,
          path: skill.path,
        });
      }
    }

    if (!skill.description || skill.description.length < 20) {
      issues.push({
        level: "error",
        code: "missing-description",
        message: "Description must be at least 20 characters",
        path: skill.path,
      });
    }

    for (const link of await extractLinks(repoRoot, skill)) {
      if (link.type === "file") {
        const target = path.join(repoRoot, skill.path, link.href);
        try {
          await fs.access(target);
        } catch {
          issues.push({
            level: "error",
            code: "broken-reference",
            message: `Broken file reference: ${link.href}`,
            path: skill.path,
          });
        }
      } else if (link.type === "script") {
        if (!scriptIds.has(link.pkg)) {
          issues.push({
            level: "error",
            code: "invalid-script-ref",
            message: `Script package not found: ${link.pkg}`,
            path: skill.path,
          });
        } else if (!(await validateExport(repoRoot, link.pkg, link.export))) {
          issues.push({
            level: "error",
            code: "invalid-script-export",
            message: `Export not found: ${link.pkg}${link.export}`,
            path: skill.path,
          });
        }
      } else if (link.type === "skill") {
        if (!skillIds.has(link.pkg)) {
          issues.push({
            level: "error",
            code: "broken-skill-ref",
            message: `Skill dependency not found: ${link.pkg}`,
            path: skill.path,
          });
        }
      }
    }

    for (const dep of skill.dependencies) {
      if (!skillIds.has(dep)) {
        issues.push({
          level: "error",
          code: "broken-dependency",
          message: `Missing skill dependency: ${dep}`,
          path: skill.path,
        });
      }
    }
  }

  for (const script of scripts) {
    if (allIds.has(script.id)) {
      issues.push({
        level: "error",
        code: "duplicate-id",
        message: `Duplicate ID between skill and script: ${script.id}`,
        path: `scripts/${script.id}`,
      });
    }
    allIds.add(script.id);
  }

  // Detect skill dependency cycles
  for (const skill of skills) {
    const visited = new Set<string>();
    const stack = [...skill.dependencies];
    while (stack.length) {
      const current = stack.pop()!;
      if (current === skill.id) {
        issues.push({
          level: "warn",
          code: "dependency-cycle",
          message: `Skill dependency cycle involving ${skill.id}`,
          path: skill.path,
        });
        break;
      }
      if (visited.has(current)) continue;
      visited.add(current);
      const depSkill = skills.find((s) => s.id === current);
      if (depSkill) stack.push(...depSkill.dependencies);
    }
  }

  return issues;
}

async function extractLinks(
  repoRoot: string,
  skill: SkillEntry,
): Promise<Array<{ type: "file" | "script" | "skill"; href: string; pkg: string; export: string }>> {
  const { parseSkillMd } = await import("@skills-house/build");
  const content = await fs.readFile(path.join(repoRoot, skill.path, "SKILL.md"), "utf-8");
  const parsed = parseSkillMd(content);
  const links: Array<{ type: "file" | "script" | "skill"; href: string; pkg: string; export: string }> = [];

  for (const link of parsed.links) {
    const classified = classifyHref(link.href);
    if (classified.type === "file") {
      links.push({ type: "file", href: classified.path, pkg: "", export: "" });
    } else {
      const workspace = await resolvePackageWorkspace(repoRoot, classified.pkg);
      links.push({
        type: workspace === "scripts" ? "script" : "skill",
        href: link.href,
        pkg: classified.pkg,
        export: classified.export,
      });
    }
  }
  return links;
}

export function formatValidationIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return "OK: registry validation passed.";
  return issues
    .map((i) => `${i.level.toUpperCase()} [${i.code}]${i.path ? ` ${i.path}:` : ""} ${i.message}`)
    .join("\n");
}

export function hasValidationErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === "error");
}
