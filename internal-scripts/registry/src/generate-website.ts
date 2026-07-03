import fs from "node:fs/promises";
import path from "node:path";
import type { Registry } from "./types.js";
import {
  graphJs,
  platformCss,
  renderGraphPage,
  renderPlatformHome,
  renderScriptPage,
  renderScriptsIndex,
  renderSearchPage,
  renderSkillPage,
  renderSkillsIndex,
  searchJs,
} from "./html.js";

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

  const dataDir = path.join(repoRoot, "website", "data");
  await writeFileEnsuringDir(path.join(dataDir, "registry.json"), JSON.stringify(rest, null, 2) + "\n");
  await writeFileEnsuringDir(path.join(dataDir, "search-index.json"), JSON.stringify(searchIndex, null, 2) + "\n");
  await writeFileEnsuringDir(
    path.join(dataDir, "dependency-graph.json"),
    JSON.stringify(registry.graph, null, 2) + "\n",
  );
}

export async function writeWebsitePages(repoRoot: string, registry: Registry): Promise<void> {
  const websiteRoot = path.join(repoRoot, "website");

  await writeFileEnsuringDir(path.join(websiteRoot, "platform.css"), platformCss());
  await writeFileEnsuringDir(path.join(websiteRoot, "platform", "index.html"), renderPlatformHome(registry));
  await writeFileEnsuringDir(path.join(websiteRoot, "skills", "index.html"), renderSkillsIndex(registry.skills));
  await writeFileEnsuringDir(path.join(websiteRoot, "scripts", "index.html"), renderScriptsIndex(registry.scripts));
  await writeFileEnsuringDir(path.join(websiteRoot, "graph", "index.html"), renderGraphPage(registry.graph, registry.skills, registry.scripts));
  await writeFileEnsuringDir(path.join(websiteRoot, "graph", "graph.js"), graphJs());
  await writeFileEnsuringDir(path.join(websiteRoot, "search", "index.html"), renderSearchPage());
  await writeFileEnsuringDir(path.join(websiteRoot, "search", "search.js"), searchJs());

  for (const skill of registry.skills) {
    await writeFileEnsuringDir(
      path.join(websiteRoot, "skills", skill.id, "index.html"),
      renderSkillPage(skill, registry.scripts),
    );
  }

  for (const script of registry.scripts) {
    await writeFileEnsuringDir(
      path.join(websiteRoot, "scripts", script.id, "index.html"),
      renderScriptPage(script),
    );
  }
}
