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

test("expands nested @include chains", () => {
  const fixture = path.join(packageRoot, "fixtures/nested-includes-skill");
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-nested-"));
  runBuild(fixture, outDir);

  const skillMd = fs.readFileSync(path.join(outDir, "SKILL.md"), "utf8");
  const body = skillMd.replace(/^---[\s\S]*?---\n/, "");
  assert.match(body, /## Outer section/);
  assert.match(body, /Inner content here/);
  assert.match(body, /Outer tail/);
  assert.doesNotMatch(body, /^@include/m);
});

test("rejects circular @include chains", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-cycle-"));
  const skillDir = path.join(tmpRoot, "cycle-skill");
  const sectionsDir = path.join(skillDir, "sections");
  fs.mkdirSync(sectionsDir, { recursive: true });
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: cycle-skill\ndescription: cycle test\n---\n\n@include /sections/a.md\n",
  );
  fs.writeFileSync(
    path.join(sectionsDir, "a.md"),
    "@include /sections/b.md\n",
  );
  fs.writeFileSync(
    path.join(sectionsDir, "b.md"),
    "@include /sections/a.md\n",
  );

  assert.throws(
    () => runBuild(skillDir, path.join(tmpRoot, "out")),
    /@include cycle detected/,
  );
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

test("injects skill dependency note with skills.sh install command", () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "skills-house-dep-"));
  const skillDir = path.join(tmpRoot, "needs-auditor");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(
    path.join(skillDir, "package.json"),
    JSON.stringify({ name: "@skills-house/needs-auditor" }),
  );
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: needs-auditor\ndescription: depends on skill-auditor for validation checks\n---\n\nUses [auditor](skill-auditor) for review.\n",
  );

  const outDir = path.join(tmpRoot, "out");
  runBuild(skillDir, outDir);

  const skillMd = fs.readFileSync(path.join(outDir, "SKILL.md"), "utf8");
  assert.match(skillMd, /> \*\*Depends on:\*\* `skill-auditor`/);
  assert.match(
    skillMd,
    /npx skills add al4f\/skills-house --skill skill-auditor/,
  );
  assert.match(skillMd, /dependencies:\s*\n\s*- skill-auditor/);
});
