import fs from "node:fs/promises";
import path from "node:path";
import type { Registry } from "./types.js";

async function writeFileEnsuringDir(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

export async function writeGeneratedJson(repoRoot: string, registry: Registry): Promise<void> {
  const json = JSON.stringify(registry, null, 2) + "\n";
  const generatedPath = path.join(repoRoot, "generated", "registry.json");
  const websitePath = path.join(repoRoot, "website", "public", "data", "registry.json");

  await writeFileEnsuringDir(generatedPath, json);
  await writeFileEnsuringDir(websitePath, json);
}
