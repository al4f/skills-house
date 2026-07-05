import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");

test("findRepoRoot detects scaffolded consumer project", async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "paths-root-"));
  const projectDir = join(tempRoot, "consumer");
  mkdirSync(join(projectDir, "skills", "demo"), { recursive: true });
  writeFileSync(join(projectDir, "package.json"), JSON.stringify({ name: "consumer" }) + "\n");

  const installPkgDir = join(
    projectDir,
    "node_modules",
    "@skills-house",
    "install",
    "dist",
  );
  mkdirSync(installPkgDir, { recursive: true });

  const { findRepoRoot } = await import(
    pathToFileURL(join(REPO_ROOT, "internal-scripts/install/dist/paths.js")).href
  );

  assert.equal(findRepoRoot(installPkgDir), projectDir);
  rmSync(tempRoot, { recursive: true, force: true });
});

test("findRepoRoot detects skills-house monorepo", async () => {
  const { findRepoRoot } = await import(
    pathToFileURL(join(REPO_ROOT, "internal-scripts/install/dist/paths.js")).href
  );

  assert.equal(
    findRepoRoot(join(REPO_ROOT, "internal-scripts/install/dist")),
    REPO_ROOT,
  );
});
