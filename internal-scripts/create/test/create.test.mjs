import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const CLI = join(REPO_ROOT, "internal-scripts/create/dist/cli.js");
const SCAFFOLD = join(REPO_ROOT, "internal-scripts/create/dist/scaffold.js");
const TEMPLATE_VENDOR = join(
  REPO_ROOT,
  "internal-scripts/create/templates/default/internal-scripts/build/dist/cli.js",
);

test("normalizeGitHubRepositoryUrl strips credentials", async () => {
  const { normalizeGitHubRepositoryUrl } = await import(
    pathToFileURL(SCAFFOLD).href
  );
  assert.equal(
    normalizeGitHubRepositoryUrl(
      "https://x-access-token:secret@github.com/test-user/my-repo.git",
    ),
    "https://github.com/test-user/my-repo.git",
  );
  assert.equal(
    normalizeGitHubRepositoryUrl("git@github.com:test-user/my-repo.git"),
    "https://github.com/test-user/my-repo.git",
  );
});

test("create-skills-house --help exits 0", () => {
  assert.ok(existsSync(CLI), "build create-skills-house first");
  const result = spawnSync(process.execPath, [CLI, "--help"], {
    encoding: "utf-8",
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /create-skills-house/);
});

test("scaffolds a project with starter skill", () => {
  assert.ok(
    existsSync(TEMPLATE_VENDOR),
    "sync template vendor first: node scripts/sync-create-template.mjs",
  );

  const tempRoot = mkdtempSync(join(tmpdir(), "create-skills-house-"));
  const projectDir = join(tempRoot, "demo-app");

  try {
    const create = spawnSync(
      process.execPath,
      [CLI, projectDir, "--skill", "onboarding", "--no-install"],
      { encoding: "utf-8" },
    );
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const skillMd = join(projectDir, "skills", "onboarding", "SKILL.md");
    assert.ok(existsSync(skillMd));
    const content = readFileSync(skillMd, "utf-8");
    assert.match(content, /name: onboarding/);
    assert.doesNotMatch(content, /__SKILL__/);

    const rootPkg = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf-8"),
    );
    assert.equal(rootPkg.name, "demo-app");
    assert.match(rootPkg.scripts.dev, /install:skills/);

    const buildCli = join(
      projectDir,
      "internal-scripts/build/dist/cli.js",
    );
    assert.ok(existsSync(buildCli));
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("rejects invalid project names", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "create-skills-house-bad-"));
  try {
    const result = spawnSync(
      process.execPath,
      [CLI, join(tempRoot, "Bad_Name"), "--no-install"],
      { encoding: "utf-8" },
    );
    assert.notEqual(result.status, 0);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("scaffolds into an existing git repository", () => {
  assert.ok(
    existsSync(TEMPLATE_VENDOR),
    "sync template vendor first: node scripts/sync-create-template.mjs",
  );

  const tempRoot = mkdtempSync(join(tmpdir(), "create-skills-house-git-"));
  const projectDir = join(tempRoot, "my-repo");
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(
    join(projectDir, "AGENTS.md"),
    "# Bootstrap\n\nRun create-skills-house here.\n",
  );

  const gitInit = spawnSync("git", ["init", "-q"], {
    cwd: projectDir,
    encoding: "utf-8",
  });
  assert.equal(gitInit.status, 0, gitInit.stderr);

  try {
    const create = spawnSync(
      process.execPath,
      [CLI, ".", "--skill", "onboarding", "--no-install"],
      { cwd: projectDir, encoding: "utf-8" },
    );
    assert.equal(create.status, 0, create.stderr || create.stdout);

    const skillMd = join(projectDir, "skills", "onboarding", "SKILL.md");
    assert.ok(existsSync(skillMd));

    const rootPkg = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf-8"),
    );
    assert.equal(rootPkg.name, "my-repo");
    assert.ok(rootPkg.repository?.url);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("rejects non-empty target directory", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "create-skills-house-full-"));
  const projectDir = join(tempRoot, "occupied");
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(join(projectDir, "existing.txt"), "stay");

  try {
    const result = spawnSync(
      process.execPath,
      [CLI, projectDir, "--no-install"],
      { encoding: "utf-8" },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /not empty/i);
    assert.match(result.stderr + result.stdout, /existing\.txt/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
