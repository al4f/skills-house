#!/usr/bin/env node
/**
 * Pack create-skills-house into an npm-ready directory.
 *
 * Usage:
 *   node scripts/pack-create.mjs
 *   node scripts/pack-create.mjs --out packages/publish
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CREATE_SRC = join(REPO_ROOT, "internal-scripts", "create");
const DIST = join(CREATE_SRC, "dist", "cli.js");
const TEMPLATES = join(CREATE_SRC, "templates");

function parseArgs(argv) {
  let outDir = join(REPO_ROOT, "packages", "publish");
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--out") outDir = resolve(argv[++i]);
  }
  return { outDir };
}

function main() {
  const { outDir } = parseArgs(process.argv);

  if (!existsSync(DIST)) {
    console.error(`create-skills-house dist not found: ${DIST} — run pnpm build first.`);
    process.exit(1);
  }

  if (!existsSync(TEMPLATES)) {
    console.error(`Templates not found: ${TEMPLATES}`);
    process.exit(1);
  }

  const sourcePkg = JSON.parse(
    readFileSync(join(CREATE_SRC, "package.json"), "utf-8"),
  );
  const dest = join(outDir, "create-skills-house");

  mkdirSync(dest, { recursive: true });
  cpSync(join(CREATE_SRC, "dist"), join(dest, "dist"), { recursive: true });
  cpSync(TEMPLATES, join(dest, "templates"), { recursive: true });

  const packageJson = {
    name: "create-skills-house",
    version: sourcePkg.version,
    description: sourcePkg.description,
    author: sourcePkg.author,
    license: sourcePkg.license,
    type: sourcePkg.type,
    repository: sourcePkg.repository,
    homepage: sourcePkg.homepage,
    keywords: sourcePkg.keywords,
    engines: { node: ">=20" },
    publishConfig: { access: "public" },
    files: ["dist", "templates"],
    bin: sourcePkg.bin,
  };

  writeFileSync(join(dest, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  console.log(`Packed create-skills-house@${sourcePkg.version} → ${dest}`);
  console.log(`Publish: cd ${dest} && npm publish --access public`);
}

main();
