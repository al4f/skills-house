#!/usr/bin/env node

// src/paths.ts
import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
var moduleDir = dirname(fileURLToPath(import.meta.url));
var PACKAGE_ROOT = resolve(moduleDir, "..");
function resolveInstallScript() {
  const packaged = join(PACKAGE_ROOT, "install", "install-skills.sh");
  if (existsSync(packaged)) {
    return packaged;
  }
  const monorepo = resolve(
    PACKAGE_ROOT,
    "../../internal-scripts/install/install-skills.sh"
  );
  if (existsSync(monorepo)) {
    return monorepo;
  }
  return null;
}
function monorepoDistDir() {
  return resolve(PACKAGE_ROOT, "../../skills-dist");
}
function defaultRepoRoot() {
  return resolve(PACKAGE_ROOT, "../..");
}
function readRepoSlug(repoRoot) {
  try {
    const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf-8"));
    const url = typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
    if (!url) return null;
    const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export {
  PACKAGE_ROOT,
  resolveInstallScript,
  monorepoDistDir,
  defaultRepoRoot,
  readRepoSlug
};
