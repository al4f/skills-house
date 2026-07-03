import fs from "node:fs/promises";
import path from "node:path";
import type { Registry } from "./types.js";

async function writeFileEnsuringDir(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

export async function writeGeneratedJson(repoRoot: string, registry: Registry): Promise<void> {
  const generatedDir = path.join(repoRoot, "generated");
  await fs.mkdir(generatedDir, { recursive: true });

  const { searchIndex, ...rest } = registry;
  await writeFileEnsuringDir(path.join(generatedDir, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
  await writeFileEnsuringDir(path.join(generatedDir, "search-index.json"), JSON.stringify(searchIndex, null, 2) + "\n");
  await writeFileEnsuringDir(
    path.join(generatedDir, "dependency-graph.json"),
    JSON.stringify(registry.graph, null, 2) + "\n",
  );

  const dataDir = path.join(repoRoot, "website", "public", "data");
  await writeFileEnsuringDir(path.join(dataDir, "registry.json"), JSON.stringify(rest, null, 2) + "\n");
  await writeFileEnsuringDir(path.join(dataDir, "search-index.json"), JSON.stringify(searchIndex, null, 2) + "\n");
  await writeFileEnsuringDir(
    path.join(dataDir, "dependency-graph.json"),
    JSON.stringify(registry.graph, null, 2) + "\n",
  );
}
