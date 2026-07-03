import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { layoutDistFromNpmPackage } from "../dist/layout-npm-skill.js";
import { resolveInstallScript } from "../dist/paths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("layoutDistFromNpmPackage wraps flat npm skill layout", () => {
  const workDir = mkdtempSync(path.join(os.tmpdir(), "skills-house-layout-"));
  const packageDir = path.join(workDir, "package");
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(path.join(packageDir, "SKILL.md"), "---\nname: demo\ndescription: x\n---\n");

  const distDir = layoutDistFromNpmPackage(packageDir, "demo", workDir);
  assert.ok(distDir);
  assert.ok(existsSync(path.join(distDir, "demo", "SKILL.md")));
});

test("resolveInstallScript finds monorepo install-skills.sh", () => {
  const script = resolveInstallScript();
  assert.ok(script);
  assert.ok(existsSync(script));
  assert.match(script, /install-skills\.sh$/);
});
