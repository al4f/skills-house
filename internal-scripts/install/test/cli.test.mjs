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
