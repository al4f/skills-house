#!/usr/bin/env node

// src/paths.ts
import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
var moduleDir = dirname(fileURLToPath(import.meta.url));
var PACKAGE_ROOT = resolve(moduleDir, "..");
function resolveInstallScript() {
  const packaged = join(PACKAGE_ROOT, "install-skills.sh");
  if (existsSync(packaged)) {
    return packaged;
  }
  return null;
}
function monorepoDistDir() {
  return resolve(PACKAGE_ROOT, "../../skills-dist");
}
function defaultRepoRoot() {
  return resolve(PACKAGE_ROOT, "../..");
}

export {
  PACKAGE_ROOT,
  resolveInstallScript,
  monorepoDistDir,
  defaultRepoRoot
};
