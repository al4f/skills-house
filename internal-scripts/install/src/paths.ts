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

export function monorepoDistDir(): string {
  return resolve(PACKAGE_ROOT, "../../skills-dist");
}

export function defaultRepoRoot(): string {
  return resolve(PACKAGE_ROOT, "../..");
}
