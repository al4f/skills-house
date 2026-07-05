#!/usr/bin/env node
/**
 * Inject published @skills-house/* versions into @skills-house/create templates.
 *
 * Run as part of @skills-house/create build:
 *   node scripts/inject-create-template-versions.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const TEMPLATE_ROOT = join(
  REPO_ROOT,
  "internal-scripts",
  "create",
  "templates",
  "default",
);

function readVersion(packageDir) {
  const pkg = JSON.parse(
    readFileSync(join(packageDir, "package.json"), "utf-8"),
  );
  return pkg.version;
}

function setDependencyVersion(pkg, name, version) {
  if (!pkg.devDependencies) {
    pkg.devDependencies = {};
  }
  pkg.devDependencies[name] = `^${version}`;
}

function updateRootPackage(buildVersion, installVersion) {
  const filePath = join(TEMPLATE_ROOT, "package.json");
  const pkg = JSON.parse(readFileSync(filePath, "utf-8"));
  setDependencyVersion(pkg, "@skills-house/build", buildVersion);
  setDependencyVersion(pkg, "@skills-house/install", installVersion);
  writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
}

function updateSkillPackage(buildVersion) {
  const filePath = join(TEMPLATE_ROOT, "skills", "__SKILL__", "package.json");
  const pkg = JSON.parse(readFileSync(filePath, "utf-8"));
  setDependencyVersion(pkg, "@skills-house/build", buildVersion);
  writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
}

function main() {
  const buildVersion = readVersion(join(REPO_ROOT, "internal-scripts", "build"));
  const installVersion = readVersion(
    join(REPO_ROOT, "internal-scripts", "install"),
  );

  updateRootPackage(buildVersion, installVersion);
  updateSkillPackage(buildVersion);

  console.log(
    `Injected template versions: @skills-house/build ^${buildVersion}, @skills-house/install ^${installVersion}`,
  );
}

main();
