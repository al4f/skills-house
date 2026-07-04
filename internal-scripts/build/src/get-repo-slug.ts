import fs from "node:fs/promises";
import path from "node:path";

type RootPackageJson = {
  repository?: string | { url?: string };
};

function parseRepoSlug(url: string): string | null {
  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  return match?.[1] ?? null;
}

export async function tryGetRepoSlug(
  repoRoot: string,
): Promise<string | null> {
  const raw = await fs.readFile(path.join(repoRoot, "package.json"), "utf-8");
  const pkg = JSON.parse(raw) as RootPackageJson;

  const url =
    typeof pkg.repository === "string"
      ? pkg.repository
      : pkg.repository?.url;
  if (!url) return null;

  return parseRepoSlug(url);
}

export async function getRepoSlug(repoRoot: string): Promise<string> {
  const slug = await tryGetRepoSlug(repoRoot);
  if (!slug) {
    throw new Error(
      "Cannot resolve repo slug: root package.json has no repository URL",
    );
  }

  return slug;
}
