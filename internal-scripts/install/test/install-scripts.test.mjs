import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const INSTALL_SCRIPT = join(REPO_ROOT, "internal-scripts/install/install-skills.sh");

function layoutConsumerProject(tempRoot) {
  const projectDir = join(tempRoot, "my-app");
  const installPkgDir = join(
    projectDir,
    "node_modules",
    "@skills-house",
    "install",
  );

  mkdirSync(installPkgDir, { recursive: true });
  mkdirSync(join(projectDir, "skills-dist", "demo-skill"), { recursive: true });
  writeFileSync(join(projectDir, "package.json"), JSON.stringify({ name: "my-app" }) + "\n");
  writeFileSync(join(projectDir, "skills-dist/demo-skill/SKILL.md"), "---\nname: demo-skill\n---\n");

  for (const file of ["install-skills.sh", "remove-skills.sh"]) {
    const src = join(REPO_ROOT, "internal-scripts/install", file);
    const dest = join(installPkgDir, file);
    const content = readFileSync(src, "utf-8");
    writeFileSync(dest, content, { mode: 0o755 });
  }

  for (const libFile of ["agent-targets.sh", "resolve-repo-root.sh"]) {
    const src = join(REPO_ROOT, "internal-scripts/install/lib", libFile);
    const dest = join(installPkgDir, "lib", libFile);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src, "utf-8"));
  }

  return { projectDir, installScript: join(installPkgDir, "install-skills.sh") };
}

test("install-skills.sh resolves project root from node_modules via INIT_CWD", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "install-root-"));
  try {
    const { projectDir, installScript } = layoutConsumerProject(tempRoot);

    const result = spawnSync(
      "bash",
      [installScript, "--scope", "project", "--dry-run"],
      {
        cwd: projectDir,
        env: {
          ...process.env,
          INIT_CWD: projectDir,
          SKILLS_REPO_ROOT: "",
        },
        encoding: "utf-8",
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /\[agents \(project\)\] → .+\/\.agents\/skills/);
    assert.doesNotMatch(result.stdout, /node_modules\/\.agents/);
    assert.match(result.stdout, /demo-skill/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("install-skills.sh resolves project root from node_modules via SKILLS_REPO_ROOT", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "install-root-"));
  try {
    const { projectDir, installScript } = layoutConsumerProject(tempRoot);

    const result = spawnSync(
      "bash",
      [installScript, "--scope", "project", "--dry-run"],
      {
        cwd: join(projectDir, "node_modules"),
        env: {
          ...process.env,
          SKILLS_REPO_ROOT: projectDir,
        },
        encoding: "utf-8",
      },
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, new RegExp(`\\[agents \\(project\\)\\] → ${projectDir}/\\.agents/skills`));
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("install-skills.sh still works from monorepo internal-scripts path", () => {
  assert.ok(existsSync(INSTALL_SCRIPT), "install script must exist in monorepo");

  const result = spawnSync(
    "bash",
    [INSTALL_SCRIPT, "--scope", "project", "--dry-run", "--skill", "skill-auditor"],
    {
      cwd: REPO_ROOT,
      encoding: "utf-8",
    },
  );

  if (!existsSync(join(REPO_ROOT, "skills-dist", "skill-auditor", "SKILL.md"))) {
    assert.match(result.stderr, /skills-dist\/ not found/);
    return;
  }

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /skill-auditor/);
  assert.doesNotMatch(result.stdout, /internal-scripts\/\.agents/);
});
