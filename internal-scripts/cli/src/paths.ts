import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));

/** Root of the @skills-house/cli package (works in monorepo dev and after npm install). */
export const PACKAGE_ROOT = resolve(moduleDir, "..");

export function resolveInstallScript(): string | null {
  const packaged = join(PACKAGE_ROOT, "install", "install-skills.sh");
  if (existsSync(packaged)) {
    return packaged;
  }

  const monorepo = resolve(
    PACKAGE_ROOT,
    "../../internal-scripts/install/install-skills.sh",
  );
  if (existsSync(monorepo)) {
    return monorepo;
  }

  return null;
}

export function monorepoDistDir(): string {
  return resolve(PACKAGE_ROOT, "../../skills-dist");
}

export function defaultRepoRoot(): string {
  return resolve(PACKAGE_ROOT, "../..");
}

export function readRepoSlug(repoRoot: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf-8")) as {
      repository?: string | { url?: string };
    };
    const url =
      typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
    if (!url) return null;
    const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
