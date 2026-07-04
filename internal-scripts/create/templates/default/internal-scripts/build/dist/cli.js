#!/usr/bin/env node
import {
  classifyHref,
  findLinks,
  parseSkillMd,
  tryGetRepoSlug
} from "./chunk-ANZL3RXW.js";

// src/cli.ts
import fs5 from "fs/promises";
import path6 from "path";

// src/build-skill.ts
import fs4 from "fs/promises";
import path5 from "path";
import YAML from "yaml";

// src/resolve-includes.ts
import fs from "fs/promises";
import path from "path";
var INCLUDE_LINE_RE = /^@include\s+(\/[^\s]+)\s*$/gm;
async function resolveIncludes(body, skillDir) {
  return resolveIncludesInBody(body, skillDir, []);
}
async function resolveIncludesInBody(body, skillDir, stack) {
  const matches = [...body.matchAll(INCLUDE_LINE_RE)];
  if (matches.length === 0) {
    return body;
  }
  let result = body;
  for (const match of matches) {
    const includePath = match[1];
    if (stack.includes(includePath)) {
      const chain = [...stack, includePath].join(" \u2192 ");
      throw new Error(`@include cycle detected: ${chain}`);
    }
    const sourcePath = path.join(skillDir, includePath.slice(1));
    let content;
    try {
      content = await fs.readFile(sourcePath, "utf-8");
    } catch {
      throw new Error(`@include file not found: ${includePath}`);
    }
    const expanded = await resolveIncludesInBody(content, skillDir, [
      ...stack,
      includePath
    ]);
    result = result.replace(match[0], expanded.trimEnd() + "\n");
  }
  return result;
}

// src/resolve-file-links.ts
import fs2 from "fs/promises";
import path2 from "path";
var ALLOWED_PREFIXES = ["/references/", "/scripts/", "/assets/"];
function mapFileHref(href) {
  for (const prefix of ALLOWED_PREFIXES) {
    if (href.startsWith(prefix)) {
      return { destRelative: href.slice(1) };
    }
  }
  throw new Error(
    `Unknown in-package path prefix: ${href} (expected /references/, /scripts/, or /assets/)`
  );
}
function rewriteLink(body, label, oldHref, newHref) {
  return body.replace(`[${label}](${oldHref})`, `[${label}](${newHref})`);
}
async function resolveFileLinks(body, links, skillDir, outDir) {
  let result = body;
  for (const link of links) {
    if (!link.href.startsWith("/")) continue;
    const { destRelative } = mapFileHref(link.href);
    const sourcePath = path2.join(skillDir, link.href.slice(1));
    const destPath = path2.join(outDir, destRelative);
    try {
      await fs2.access(sourcePath);
    } catch {
      throw new Error(`Linked file not found: ${link.href}`);
    }
    await fs2.mkdir(path2.dirname(destPath), { recursive: true });
    await fs2.copyFile(sourcePath, destPath);
    result = rewriteLink(result, link.label, link.href, destRelative);
  }
  return result;
}

// src/resolve-package-link.ts
import fs3 from "fs/promises";
import path3 from "path";
async function readPackageJson(pkgDir) {
  const raw = await fs3.readFile(path3.join(pkgDir, "package.json"), "utf-8");
  return JSON.parse(raw);
}
async function findPackageDir(repoRoot, pkg) {
  const scriptsDir = path3.join(repoRoot, "scripts", pkg);
  try {
    await fs3.access(path3.join(scriptsDir, "package.json"));
    return { dir: scriptsDir, workspace: "scripts" };
  } catch {
  }
  const skillsDir = path3.join(repoRoot, "skills", pkg);
  try {
    await fs3.access(path3.join(skillsDir, "package.json"));
    return { dir: skillsDir, workspace: "skills" };
  } catch {
    throw new Error(`Package not found: ${pkg}`);
  }
}
function resolveExportTarget(pkgJson, exportKey) {
  const exports = pkgJson.exports ?? {};
  const target = exports[exportKey];
  if (!target) {
    throw new Error(`Export not found: ${exportKey}`);
  }
  return target;
}
function rewriteLink2(body, label, oldHref, newHref) {
  return body.replace(`[${label}](${oldHref})`, `[${label}](${newHref})`);
}
async function copyScriptPackage(pkgDir, outDir, copied, pkg) {
  if (copied.has(pkg)) return;
  const scriptsSrc = path3.join(pkgDir, "scripts");
  const scriptsDest = path3.join(outDir, "scripts");
  await fs3.mkdir(scriptsDest, { recursive: true });
  const entries = await fs3.readdir(scriptsSrc, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    await fs3.copyFile(
      path3.join(scriptsSrc, entry.name),
      path3.join(scriptsDest, entry.name)
    );
  }
  copied.add(pkg);
}
function replaceWithDependencyNote(body, label, href, pkg, repoSlug) {
  const installCommand = `npx skills add ${repoSlug} --skill ${pkg}`;
  const note = `> **Depends on:** \`${pkg}\`
> If this skill is not available in the workspace, suggest the user install it:
> \`${installCommand}\``;
  return body.replace(`[${label}](${href})`, note);
}
async function resolvePackageLinks(body, links, repoRoot, repoSlug, outDir, dependencies) {
  let result = body;
  const copiedScriptPackages = /* @__PURE__ */ new Set();
  for (const link of links) {
    const classified = classifyHref(link.href);
    if (classified.type === "file") continue;
    const { pkg, export: exportKey } = classified;
    const { dir, workspace } = await findPackageDir(repoRoot, pkg);
    if (workspace === "skills") {
      if (!repoSlug) {
        throw new Error(
          `Cannot resolve skill dependency "${pkg}": root package.json has no GitHub repository URL. Add a "repository" field, then rebuild.`
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
        repoSlug
      );
      continue;
    }
    const pkgJson = await readPackageJson(dir);
    const exportTarget = resolveExportTarget(pkgJson, exportKey);
    await copyScriptPackage(dir, outDir, copiedScriptPackages, pkg);
    const destRelative = path3.join("scripts", path3.basename(exportTarget));
    result = rewriteLink2(result, link.label, link.href, destRelative);
  }
  return result;
}

// src/validate-skill-name.ts
import path4 from "path";
function validateSkillName(frontmatter, skillDir) {
  const dirName = path4.basename(path4.resolve(skillDir));
  const name = typeof frontmatter.name === "string" ? frontmatter.name.trim() : "";
  if (!name) {
    throw new Error(
      `SKILL.md: missing required frontmatter "name" (directory: ${dirName})`
    );
  }
  if (name !== dirName) {
    throw new Error(
      `SKILL.md: frontmatter name "${name}" must match directory "${dirName}"`
    );
  }
  return name;
}

// src/build-skill.ts
function skillNameFrom(frontmatter, skillDir) {
  return validateSkillName(frontmatter, skillDir);
}
async function buildSkill(options) {
  const { skillDir, outDir, repoRoot } = options;
  const skillMdPath = path5.join(skillDir, "SKILL.md");
  const raw = await fs4.readFile(skillMdPath, "utf-8");
  const parsed = parseSkillMd(raw);
  validateSkillName(parsed.frontmatter, skillDir);
  let body = await resolveIncludes(parsed.body, skillDir);
  const links = findLinks(body);
  const dependencies = [];
  body = await resolveFileLinks(body, links, skillDir, outDir);
  const repoSlug = await tryGetRepoSlug(repoRoot);
  body = await resolvePackageLinks(
    body,
    links,
    repoRoot,
    repoSlug,
    outDir,
    dependencies
  );
  const frontmatter = { ...parsed.frontmatter };
  if (dependencies.length > 0) {
    const metadata = frontmatter.metadata ?? {};
    const existing = Array.isArray(metadata.dependencies) ? metadata.dependencies : [];
    frontmatter.metadata = {
      ...metadata,
      dependencies: [.../* @__PURE__ */ new Set([...existing, ...dependencies])]
    };
  }
  await fs4.mkdir(outDir, { recursive: true });
  const output = `---
${YAML.stringify(frontmatter).trimEnd()}
---
${body}`;
  await fs4.writeFile(path5.join(outDir, "SKILL.md"), output);
}

// src/cli.ts
function printHelp() {
  console.log(`@skills-house/build \u2014 compile a source skill to skills-dist/

Usage:
  npx @skills-house/build <skill-dir> [--out <dir>] [--repo-root <path>]

Options:
  --out        Output directory (default: <repo-root>/skills-dist/<skill-name>)
  --repo-root  Monorepo root (default: nearest pnpm-workspace.yaml ancestor)
  --help       Show this help
`);
}
async function findRepoRoot(startDir) {
  let dir = path6.resolve(startDir);
  while (true) {
    try {
      await fs5.access(path6.join(dir, "pnpm-workspace.yaml"));
      return dir;
    } catch {
      const parent = path6.dirname(dir);
      if (parent === dir) {
        throw new Error("Could not find repo root (pnpm-workspace.yaml)");
      }
      dir = parent;
    }
  }
}
function parseArgs(argv) {
  const positional = [];
  let outDir;
  let repoRoot;
  let help = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--out") {
      outDir = argv[++i];
    } else if (arg === "--repo-root") {
      repoRoot = argv[++i];
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  return { skillDir: positional[0], outDir, repoRoot, help };
}
async function main() {
  const { skillDir, outDir, repoRoot: repoRootArg, help } = parseArgs(
    process.argv.slice(2)
  );
  if (help) {
    printHelp();
    return;
  }
  if (!skillDir) {
    printHelp();
    process.exit(1);
  }
  const resolvedSkillDir = path6.resolve(skillDir);
  const repoRoot = path6.resolve(
    repoRootArg ?? await findRepoRoot(resolvedSkillDir)
  );
  const raw = await fs5.readFile(path6.join(resolvedSkillDir, "SKILL.md"), "utf-8");
  const parsed = parseSkillMd(raw);
  const skillName = skillNameFrom(parsed.frontmatter, resolvedSkillDir);
  const out = path6.resolve(
    outDir ?? path6.join(repoRoot, "skills-dist", skillName)
  );
  await buildSkill({
    skillDir: resolvedSkillDir,
    outDir: out,
    repoRoot
  });
  console.log(`Built ${skillName} \u2192 ${out}`);
}
main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
