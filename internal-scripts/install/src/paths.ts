import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));

/** Root of the @skills-house/install package (works in monorepo dev and after npm install). */
export const PACKAGE_ROOT = resolve(moduleDir, "..");

export function resolveInstallScript(): string | null {
  const packaged = join(PACKAGE_ROOT, "install-skills.sh");
  if (existsSync(packaged)) {
    return packaged;
  }

  return null;
}

function isSkillsHouseMonorepo(dir: string): boolean {
  return existsSync(join(dir, "pnpm-workspace.yaml"));
}

function isSkillsProjectRoot(dir: string): boolean {
  if (!existsSync(join(dir, "package.json"))) {
    return false;
  }
  return existsSync(join(dir, "skills-dist")) || existsSync(join(dir, "skills"));
}

export function findRepoRoot(startDir: string): string {
  let dir = resolve(startDir);

  while (true) {
    if (isSkillsHouseMonorepo(dir) || isSkillsProjectRoot(dir)) {
      return dir;
    }

    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }

  if (PACKAGE_ROOT.includes(join("internal-scripts", "install"))) {
    return resolve(PACKAGE_ROOT, "../..");
  }

  if (PACKAGE_ROOT.includes(join("node_modules", "@skills-house", "install"))) {
    return resolve(PACKAGE_ROOT, "../../..");
  }

  return resolve(PACKAGE_ROOT, "../..");
}

export function defaultRepoRoot(): string {
  if (process.env.SKILLS_REPO_ROOT) {
    return resolve(process.env.SKILLS_REPO_ROOT);
  }

  if (process.env.INIT_CWD) {
    return resolve(process.env.INIT_CWD);
  }

  return findRepoRoot(process.cwd());
}

export function monorepoDistDir(): string {
  return join(defaultRepoRoot(), "skills-dist");
}
