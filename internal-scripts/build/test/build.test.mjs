import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const cli = path.join(packageRoot, "dist/cli.js");
const fixtureDir = path.join(packageRoot, "fixtures/minimal-skill");

function runBuild(skillDir, outDir) {
  execFileSync(
    process.execPath,
    [cli, skillDir, "--out", outDir, "--repo-root", repoRoot],
    { stdio: "pipe" },
  );
}

test("builds minimal-skill fixture with includes, file links, and script refs", () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-test-"));
  runBuild(fixtureDir, outDir);

  const skillMd = fs.readFileSync(path.join(outDir, "SKILL.md"), "utf8");
  assert.match(skillMd, /Step one/);
  assert.match(skillMd, /\[the guide\]\(references\/guide\.md\)/);
  assert.match(skillMd, /\[Run helper\]\(scripts\/hello\.sh\)/);
  assert.ok(fs.existsSync(path.join(outDir, "references/guide.md")));
  assert.ok(fs.existsSync(path.join(outDir, "scripts/hello.sh")));
});

test("rejects frontmatter name that does not match directory", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-bad-"));
  const skillDir = path.join(tmpRoot, "wrong-name");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: other-name\ndescription: bad\n---\n\n# Bad\n",
  );

  assert.throws(
    () => runBuild(skillDir, path.join(tmpRoot, "out")),
    /must match directory "wrong-name"/,
  );
});
