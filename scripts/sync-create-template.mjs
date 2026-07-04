#!/usr/bin/env node
/**
 * Sync vendored framework packages into create-skills-house templates.
 *
 * Run after building @skills-house/build and @skills-house/cli:
 *   pnpm --filter @skills-house/build build
 *   pnpm --filter @skills-house/cli build
 *   node scripts/sync-create-template.mjs
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
  "internal-scripts",
);

const BUILD_SRC = join(REPO_ROOT, "internal-scripts", "build");
const CLI_SRC = join(REPO_ROOT, "internal-scripts", "cli");
const INSTALL_SRC = join(REPO_ROOT, "internal-scripts", "install");

function assertBuilt(distPath, label) {
  if (!existsSync(distPath)) {
    console.error(`Missing ${label} dist: ${distPath}`);
    console.error(`Build first: pnpm --filter ${label} build`);
    process.exit(1);
  }
}

function writeBuildPackage(destDir) {
  const source = JSON.parse(readFileSync(join(BUILD_SRC, "package.json"), "utf-8"));
  const pkg = {
    name: source.name,
    version: source.version,
    private: true,
    type: source.type,
    exports: source.exports,
    bin: source.bin,
    dependencies: source.dependencies,
  };
  writeFileSync(join(destDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
}

function writeCliPackage(destDir) {
  const source = JSON.parse(readFileSync(join(CLI_SRC, "package.json"), "utf-8"));
  const pkg = {
    name: source.name,
    version: source.version,
    private: true,
    type: source.type,
    bin: source.bin,
    dependencies: source.dependencies ?? {},
  };
  writeFileSync(join(destDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
}

function syncPackage({ src, dest, distLabel, writePackage }) {
  assertBuilt(join(src, "dist"), distLabel);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(join(src, "dist"), join(dest, "dist"), { recursive: true });
  writePackage(dest);
  console.log(`Synced ${distLabel} → ${dest}`);
}

function syncInstall() {
  const dest = join(TEMPLATE_ROOT, "install");
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(join(dest, "lib"), { recursive: true });
  cpSync(join(INSTALL_SRC, "install-skills.sh"), join(dest, "install-skills.sh"));
  cpSync(join(INSTALL_SRC, "remove-skills.sh"), join(dest, "remove-skills.sh"));
  cpSync(
    join(INSTALL_SRC, "lib", "agent-targets.sh"),
    join(dest, "lib", "agent-targets.sh"),
  );
  console.log(`Synced install scripts → ${dest}`);
}

function main() {
  syncPackage({
    src: BUILD_SRC,
    dest: join(TEMPLATE_ROOT, "build"),
    distLabel: "@skills-house/build",
    writePackage: writeBuildPackage,
  });
  syncPackage({
    src: CLI_SRC,
    dest: join(TEMPLATE_ROOT, "cli"),
    distLabel: "@skills-house/cli",
    writePackage: writeCliPackage,
  });
  syncInstall();
  console.log("create-skills-house template vendor sync complete.");
}

main();
