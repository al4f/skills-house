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

export type ScaffoldOptions = {
  targetDir: string;
  projectName: string;
  skillName: string;
  templateRoot: string;
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
  return content
    .replaceAll("{{projectName}}", options.projectName)
    .replaceAll("{{skillName}}", options.skillName)
    .replaceAll("__SKILL__", options.skillName);
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
    const entries = readdirSync(options.targetDir);
    if (entries.length > 0) {
      throw new Error(
        `Target directory is not empty: ${options.targetDir}`,
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
