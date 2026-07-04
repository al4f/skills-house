import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_PLACEHOLDER_DIR = "__SKILL__";

/** Entries allowed in a target dir when bootstrapping into an existing Git repo. */
const BOOTSTRAP_ALLOWLIST = new Set([
  ".git",
  "AGENTS.md",
  "README.md",
  ".gitignore",
  "LICENSE",
  "LICENSE.md",
]);

export type ScaffoldOptions = {
  targetDir: string;
  projectName: string;
  skillName: string;
  templateRoot: string;
  repositoryUrl?: string;
};

function mapEntryName(name: string, skillName: string): string {
  return name === SKILL_PLACEHOLDER_DIR ? skillName : name;
}

function shouldTransform(filePath: string): boolean {
  const base = basename(filePath);
  if (base.startsWith(".")) return true;
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")) : "";
  return [".md", ".json", ".yaml", ".yml", ".sh", ".txt", ""].includes(ext);
}

function applyPlaceholders(content: string, options: ScaffoldOptions): string {
  const repositoryUrl =
    options.repositoryUrl ??
    `https://github.com/YOUR_ORG/${options.projectName}.git`;

  return content
    .replaceAll("{{projectName}}", options.projectName)
    .replaceAll("{{skillName}}", options.skillName)
    .replaceAll("{{repositoryUrl}}", repositoryUrl)
    .replaceAll("__SKILL__", options.skillName);
}

function blockingEntries(targetDir: string): string[] {
  return readdirSync(targetDir).filter((name) => !BOOTSTRAP_ALLOWLIST.has(name));
}

export function normalizeGitHubRepositoryUrl(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("git@github.com:")) {
    const slug = trimmed.slice("git@github.com:".length).replace(/\.git$/, "");
    return `https://github.com/${slug}.git`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname !== "github.com") return trimmed;

    parsed.username = "";
    parsed.password = "";
    let pathname = parsed.pathname.replace(/\/$/, "");
    if (!pathname.endsWith(".git")) {
      pathname += ".git";
    }
    return `https://github.com${pathname}`;
  } catch {
    return trimmed;
  }
}

export function detectGitRepositoryUrl(targetDir: string): string | undefined {
  const result = spawnSync("git", ["remote", "get-url", "origin"], {
    cwd: targetDir,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) return undefined;

  return normalizeGitHubRepositoryUrl(result.stdout);
}

function copyFile(
  sourcePath: string,
  destPath: string,
  options: ScaffoldOptions,
): void {
  mkdirSync(dirname(destPath), { recursive: true });

  if (shouldTransform(sourcePath)) {
    const raw = readFileSync(sourcePath, "utf-8");
    writeFileSync(destPath, applyPlaceholders(raw, options));
    return;
  }

  cpSync(sourcePath, destPath);
}

function copyEntry(
  sourcePath: string,
  destPath: string,
  options: ScaffoldOptions,
): void {
  const stat = statSync(sourcePath);

  if (stat.isDirectory()) {
    mkdirSync(destPath, { recursive: true });
    for (const entry of readdirSync(sourcePath)) {
      const mapped = mapEntryName(entry, options.skillName);
      copyEntry(join(sourcePath, entry), join(destPath, mapped), options);
    }
    return;
  }

  copyFile(sourcePath, destPath, options);
}

export function resolveTemplateRoot(packageRoot: string): string {
  const templateRoot = join(packageRoot, "templates", "default");
  if (!existsSync(templateRoot)) {
    throw new Error(`Template not found: ${templateRoot}`);
  }
  return templateRoot;
}

export function packageRootFromImportMeta(importMetaUrl: string): string {
  return resolve(dirname(fileURLToPath(importMetaUrl)), "..");
}

export function scaffoldProject(options: ScaffoldOptions): void {
  if (existsSync(options.targetDir)) {
    const blocking = blockingEntries(options.targetDir);
    if (blocking.length > 0) {
      throw new Error(
        `Target directory is not empty: ${options.targetDir} (found: ${blocking.join(", ")})`,
      );
    }
  } else {
    mkdirSync(options.targetDir, { recursive: true });
  }

  for (const entry of readdirSync(options.templateRoot)) {
    const mapped = mapEntryName(entry, options.skillName);
    copyEntry(
      join(options.templateRoot, entry),
      join(options.targetDir, mapped),
      options,
    );
  }
}
