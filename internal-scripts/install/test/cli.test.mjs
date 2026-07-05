import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const CLI = join(REPO_ROOT, "internal-scripts/install/dist/cli.js");

test("install CLI --help exits 0", () => {
  assert.ok(
    existsSync(CLI),
    "build install CLI first: pnpm --filter @skills-house/install build",
  );
  const result = spawnSync(process.execPath, [CLI, "--help"], { encoding: "utf-8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /install-skills add/);
});

test("install CLI add --dry-run against skills-dist", () => {
  const dist = join(REPO_ROOT, "skills-dist");
  const skillMd = join(dist, "skill-auditor", "SKILL.md");
  assert.ok(existsSync(skillMd), "build skill-auditor first");

  const result = spawnSync(
    process.execPath,
    [CLI, "add", "skill-auditor", "--from", dist, "--dry-run"],
    { encoding: "utf-8" },
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /skill-auditor/);
});

test("install CLI add glob --dry-run", () => {
  const dist = join(REPO_ROOT, "skills-dist");
  assert.ok(existsSync(join(dist, "skills-house-build", "SKILL.md")), "build product skills first");

  const result = spawnSync(
    process.execPath,
    [CLI, "add", "skills-house-*", "--from", dist, "--dry-run"],
    { encoding: "utf-8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /skills-house-build/);
  assert.match(result.stdout, /skills-house-install/);
});

test("install CLI list --from skills-dist", () => {
  const dist = join(REPO_ROOT, "skills-dist");
  assert.ok(existsSync(dist), "build skills first");

  const result = spawnSync(
    process.execPath,
    [CLI, "list", "--from", dist, "--skill", "skills-house-*"],
    { encoding: "utf-8" },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /skills-house-build/);
  assert.doesNotMatch(result.stdout, /skill-auditor/);
});
