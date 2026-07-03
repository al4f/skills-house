#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { buildSkill, skillNameFrom } from "./build-skill.js";
import { parseSkillMd } from "./parse-skill-md.js";

function printHelp(): void {
  console.log(`skills-house-build — compile a source skill to skills-dist/

Usage:
  skills-house-build <skill-dir> [--out <dir>] [--repo-root <path>]

Options:
  --out        Output directory (default: <repo-root>/skills-dist/<skill-name>)
  --repo-root  Monorepo root (default: nearest pnpm-workspace.yaml ancestor)
  --help       Show this help
`);
}

async function findRepoRoot(startDir: string): Promise<string> {
  let dir = path.resolve(startDir);
  while (true) {
    try {
      await fs.access(path.join(dir, "pnpm-workspace.yaml"));
      return dir;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) {
        throw new Error("Could not find repo root (pnpm-workspace.yaml)");
      }
      dir = parent;
    }
  }
}

function parseArgs(argv: string[]): {
  skillDir?: string;
  outDir?: string;
  repoRoot?: string;
  help: boolean;
} {
  const positional: string[] = [];
  let outDir: string | undefined;
  let repoRoot: string | undefined;
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--out") {
      outDir = argv[++i];
    } else if (arg === "--repo-root") {
      repoRoot = argv[++i];
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  return { skillDir: positional[0], outDir, repoRoot, help };
}

async function main(): Promise<void> {
  const { skillDir, outDir, repoRoot: repoRootArg, help } = parseArgs(
    process.argv.slice(2),
  );

  if (help) {
    printHelp();
    return;
  }

  if (!skillDir) {
    printHelp();
    process.exit(1);
  }

  const resolvedSkillDir = path.resolve(skillDir);
  const repoRoot = path.resolve(
    repoRootArg ?? (await findRepoRoot(resolvedSkillDir)),
  );

  const raw = await fs.readFile(path.join(resolvedSkillDir, "SKILL.md"), "utf-8");
  const parsed = parseSkillMd(raw);
  const skillName = skillNameFrom(parsed.frontmatter, resolvedSkillDir);
  const out = path.resolve(
    outDir ?? path.join(repoRoot, "skills-dist", skillName),
  );

  await buildSkill({
    skillDir: resolvedSkillDir,
    outDir: out,
    repoRoot,
  });

  console.log(`Built ${skillName} → ${out}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
