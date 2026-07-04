import fs from "node:fs/promises";
import path from "node:path";
import { classifyHref } from "./classify-href.js";
import type { SkillLink } from "./parse-skill-md.js";

type PackageJson = {
  exports?: Record<string, string>;
};

async function readPackageJson(pkgDir: string): Promise<PackageJson> {
  const raw = await fs.readFile(path.join(pkgDir, "package.json"), "utf-8");
  return JSON.parse(raw) as PackageJson;
}

async function findPackageDir(
  repoRoot: string,
  pkg: string,
): Promise<{ dir: string; workspace: "scripts" | "skills" }> {
  const scriptsDir = path.join(repoRoot, "scripts", pkg);
  try {
    await fs.access(path.join(scriptsDir, "package.json"));
    return { dir: scriptsDir, workspace: "scripts" };
  } catch {
    // not in scripts/
  }

  const skillsDir = path.join(repoRoot, "skills", pkg);
  try {
    await fs.access(path.join(skillsDir, "package.json"));
    return { dir: skillsDir, workspace: "skills" };
  } catch {
    throw new Error(`Package not found: ${pkg}`);
  }
}

function resolveExportTarget(
  pkgJson: PackageJson,
  exportKey: string,
): string {
  const exports = pkgJson.exports ?? {};
  const target = exports[exportKey];
  if (!target) {
    throw new Error(`Export not found: ${exportKey}`);
  }
  return target;
}

function rewriteLink(
  body: string,
  label: string,
  oldHref: string,
  newHref: string,
): string {
  return body.replace(`[${label}](${oldHref})`, `[${label}](${newHref})`);
}

async function copyScriptPackage(
  pkgDir: string,
  outDir: string,
  copied: Set<string>,
  pkg: string,
): Promise<void> {
  if (copied.has(pkg)) return;

  const scriptsSrc = path.join(pkgDir, "scripts");
  const scriptsDest = path.join(outDir, "scripts");
  await fs.mkdir(scriptsDest, { recursive: true });

  const entries = await fs.readdir(scriptsSrc, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    await fs.copyFile(
      path.join(scriptsSrc, entry.name),
      path.join(scriptsDest, entry.name),
    );
  }

  copied.add(pkg);
}

function replaceWithDependencyNote(
  body: string,
  label: string,
  href: string,
  pkg: string,
  repoSlug: string,
): string {
  const installCommand = `npx skills add ${repoSlug} --skill ${pkg}`;
  const note = `> **Depends on:** \`${pkg}\`\n> If this skill is not available in the workspace, suggest the user install it:\n> \`${installCommand}\``;
  return body.replace(`[${label}](${href})`, note);
}

export async function resolvePackageLinks(
  body: string,
  links: SkillLink[],
  repoRoot: string,
  repoSlug: string | null,
  outDir: string,
  dependencies: string[],
): Promise<string> {
  let result = body;
  const copiedScriptPackages = new Set<string>();

  for (const link of links) {
    const classified = classifyHref(link.href);
    if (classified.type === "file") continue;

    const { pkg, export: exportKey } = classified;

    const { dir, workspace } = await findPackageDir(repoRoot, pkg);

    if (workspace === "skills") {
      if (!repoSlug) {
        throw new Error(
          `Cannot resolve skill dependency "${pkg}": root package.json has no GitHub repository URL. Add a "repository" field, then rebuild.`,
        );
      }
      if (!dependencies.includes(pkg)) {
        dependencies.push(pkg);
      }
      result = replaceWithDependencyNote(
        result,
        link.label,
        link.href,
        pkg,
        repoSlug,
      );
      continue;
    }

    const pkgJson = await readPackageJson(dir);
    const exportTarget = resolveExportTarget(pkgJson, exportKey);

    await copyScriptPackage(dir, outDir, copiedScriptPackages, pkg);
    const destRelative = path.join("scripts", path.basename(exportTarget));
    result = rewriteLink(result, link.label, link.href, destRelative);
  }

  return result;
}
