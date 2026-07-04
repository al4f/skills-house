import fs from "node:fs/promises";
import path from "node:path";

type RootPackageJson = {
  repository?: string | { url?: string };
};

export async function getRepoSlug(repoRoot: string): Promise<string> {
  const raw = await fs.readFile(path.join(repoRoot, "package.json"), "utf-8");
  const pkg = JSON.parse(raw) as RootPackageJson;

  const url =
    typeof pkg.repository === "string"
      ? pkg.repository
      : pkg.repository?.url;
  if (!url) {
    throw new Error(
      "Cannot resolve repo slug: root package.json has no repository URL",
    );
  }

  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  if (!match) {
    throw new Error(`Cannot parse GitHub repo slug from: ${url}`);
  }

  return match[1]!;
}
