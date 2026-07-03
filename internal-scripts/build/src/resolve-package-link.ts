import fs from "node:fs/promises";
import path from "node:path";
import * as esbuild from "esbuild";
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

async function bundleScriptExport(
  sourcePath: string,
  outDir: string,
  basename: string,
): Promise<string> {
  const ext = path.extname(sourcePath).toLowerCase();
  const destRelative = path.join("scripts", basename);

  await fs.mkdir(path.join(outDir, "scripts"), { recursive: true });

  if (ext === ".sh" || ext === ".bash") {
    await fs.copyFile(sourcePath, path.join(outDir, destRelative));
    return destRelative;
  }

  if (ext === ".js" || ext === ".ts" || ext === ".mjs" || ext === ".cjs") {
    const outPath = path.join(outDir, destRelative);
    const source = await fs.readFile(sourcePath, "utf-8");
    const hasImports = /^\s*import\s/m.test(source) || /\brequire\s*\(/.test(source);

    if (hasImports) {
      const outExt = ext === ".ts" ? ".js" : ext;
      const bundleDest = path.join(outDir, "scripts", path.basename(basename, ext) + outExt);
      await esbuild.build({
        entryPoints: [sourcePath],
        bundle: true,
        platform: "node",
        outfile: bundleDest,
        format: ext === ".cjs" || ext === ".js" ? "cjs" : "esm",
      });
      return path.join("scripts", path.basename(bundleDest));
    }

    await fs.copyFile(sourcePath, outPath);
    return destRelative;
  }

  await fs.copyFile(sourcePath, path.join(outDir, destRelative));
  return destRelative;
}

function rewriteLink(
  body: string,
  label: string,
  oldHref: string,
  newHref: string,
): string {
  return body.replace(`[${label}](${oldHref})`, `[${label}](${newHref})`);
}

function replaceWithDependencyNote(
  body: string,
  label: string,
  href: string,
  pkg: string,
): string {
  const note = `> **Depends on:** \`${pkg}\`\n> If this skill is not available in the workspace, suggest the user install it:\n> \`npx skills add ${pkg}\``;
  return body.replace(`[${label}](${href})`, note);
}

export async function resolvePackageLinks(
  body: string,
  links: SkillLink[],
  repoRoot: string,
  outDir: string,
  dependencies: string[],
): Promise<string> {
  let result = body;

  for (const link of links) {
    const classified = classifyHref(link.href);
    if (classified.type === "file") continue;

    const { pkg, export: exportKey } = classified;

    const { dir, workspace } = await findPackageDir(repoRoot, pkg);
    const pkgJson = await readPackageJson(dir);
    const exportTarget = resolveExportTarget(pkgJson, exportKey);

    if (workspace === "skills") {
      if (!dependencies.includes(pkg)) {
        dependencies.push(pkg);
      }
      result = replaceWithDependencyNote(result, link.label, link.href, pkg);
      continue;
    }

    const sourcePath = path.join(dir, exportTarget);
    const basename = path.basename(exportTarget);
    const destRelative = await bundleScriptExport(sourcePath, outDir, basename);
    result = rewriteLink(result, link.label, link.href, destRelative);
  }

  return result;
}
