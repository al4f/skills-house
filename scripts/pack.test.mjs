import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function runPack(script, args = []) {
  execFileSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    stdio: "pipe",
  });
}

test("pack-cli emits publish-ready package.json", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-pack-cli-"));
  runPack(path.join(repoRoot, "scripts/pack-cli.mjs"), ["--out", outDir]);

  const pkgPath = path.join(outDir, "cli", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(pkg.name, "@skills-house/cli");
  assert.equal(pkg.publishConfig.access, "public");
  assert.ok(fs.existsSync(path.join(outDir, "cli", "dist", "cli.js")));
});

test("pack-skill emits publish-ready package.json", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-pack-skill-"));
  runPack(path.join(repoRoot, "scripts/pack-skill.mjs"), [
    "skill-auditor",
    "--out",
    outDir,
  ]);

  const pkgPath = path.join(outDir, "skill-skill-auditor", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(pkg.name, "@skills-house/skill-skill-auditor");
  assert.equal(pkg.publishConfig.access, "public");
  assert.ok(fs.existsSync(path.join(outDir, "skill-skill-auditor", "SKILL.md")));
});
