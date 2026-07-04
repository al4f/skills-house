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

test("pack-install emits publish-ready package.json", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-pack-install-"));
  runPack(path.join(repoRoot, "scripts/pack-install.mjs"), ["--out", outDir]);

  const pkgPath = path.join(outDir, "install", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(pkg.name, "@skills-house/install");
  assert.equal(pkg.publishConfig.access, "public");
  assert.ok(fs.existsSync(path.join(outDir, "install", "dist", "cli.js")));
  assert.ok(fs.existsSync(path.join(outDir, "install", "install-skills.sh")));
  assert.ok(fs.existsSync(path.join(outDir, "install", "lib", "agent-targets.sh")));
});

test("pack-build emits publish-ready package.json", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-pack-build-"));
  runPack(path.join(repoRoot, "scripts/pack-build.mjs"), ["--out", outDir]);

  const pkgPath = path.join(outDir, "build", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(pkg.name, "@skills-house/build");
  assert.equal(pkg.publishConfig.access, "public");
  assert.equal(pkg.bin.build, "./dist/cli.js");
  assert.ok(fs.existsSync(path.join(outDir, "build", "dist", "cli.js")));
  assert.ok(fs.existsSync(path.join(outDir, "build", "dist", "lib.js")));
});

test("pack-create emits publish-ready package.json", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-pack-create-"));
  runPack(path.join(repoRoot, "scripts/pack-create.mjs"), ["--out", outDir]);

  const pkgPath = path.join(outDir, "create", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  assert.equal(pkg.name, "@skills-house/create");
  assert.equal(pkg.publishConfig.access, "public");
  assert.equal(pkg.bin.create, "./dist/cli.js");
  assert.ok(fs.existsSync(path.join(outDir, "create", "dist", "cli.js")));
  assert.ok(fs.existsSync(path.join(outDir, "create", "templates")));
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
