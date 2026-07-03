#!/usr/bin/env node
/**
 * Pack a built skill from skills-dist/ into an npm-ready directory.
 *
 * Usage:
 *   node scripts/pack-skill.mjs skill-auditor
 *   node scripts/pack-skill.mjs skill-auditor --out packages/publish
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const skill = argv[2];
  if (!skill || skill.startsWith("-")) {
    console.error("Usage: node scripts/pack-skill.mjs <skill-name> [--out <dir>]");
    process.exit(1);
  }
  let outDir = join(REPO_ROOT, "packages", "publish");
  for (let i = 3; i < argv.length; i++) {
    if (argv[i] === "--out") outDir = resolve(argv[++i]);
  }
  return { skill, outDir };
}

function main() {
  const { skill, outDir } = parseArgs(process.argv);
  const src = join(REPO_ROOT, "skills-dist", skill);
  const skillMd = join(src, "SKILL.md");

  if (!existsSync(skillMd)) {
    console.error(`Skill not found: ${src} — run pnpm build first.`);
    process.exit(1);
  }

  const frontmatter = readFileSync(skillMd, "utf-8").match(/^---\n([\s\S]*?)\n---/);
  let description = `Agent Skill: ${skill}`;
  if (frontmatter) {
    const desc = frontmatter[1].match(/^description:\s*["']?(.+?)["']?\s*$/m);
    if (desc) description = desc[1];
  }

  const pkgName = `@skills-house/skill-${skill}`;
  const dest = join(outDir, `skill-${skill}`);

  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });

  const packageJson = {
    name: pkgName,
    version: "0.0.1",
    description,
    author: "al4f <https://al4f.dev>",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/al4f/skills-house.git",
      directory: `skills/${skill}`,
    },
    homepage: "https://al4f.dev",
    keywords: ["agent-skills", "cursor", "claude", "codex", "skills-house"],
    engines: { node: ">=20" },
    publishConfig: { access: "public" },
    files: ["SKILL.md", "references", "scripts", "assets"],
  };

  writeFileSync(join(dest, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  console.log(`Packed ${pkgName} → ${dest}`);
  console.log(`Publish: cd ${dest} && npm publish --access public`);
}

main();
