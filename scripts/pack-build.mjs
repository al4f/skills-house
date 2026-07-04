#!/usr/bin/env node
/**
 * Pack @skills-house/build into an npm-ready directory.
 *
 * Usage:
 *   node scripts/pack-build.mjs
 *   node scripts/pack-build.mjs --out packages/publish
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const BUILD_SRC = join(REPO_ROOT, "internal-scripts", "build");
const DIST = join(BUILD_SRC, "dist", "cli.js");

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
    console.error(`@skills-house/build dist not found: ${DIST} — run pnpm build first.`);
    process.exit(1);
  }

  const sourcePkg = JSON.parse(
    readFileSync(join(BUILD_SRC, "package.json"), "utf-8"),
  );
  const dest = join(outDir, "build");

  mkdirSync(dest, { recursive: true });
  cpSync(join(BUILD_SRC, "dist"), join(dest, "dist"), { recursive: true });

  const packageJson = {
    name: sourcePkg.name,
    version: sourcePkg.version,
    description: sourcePkg.description,
    author: sourcePkg.author,
    license: sourcePkg.license,
    type: sourcePkg.type,
    repository: sourcePkg.repository,
    homepage: sourcePkg.homepage,
    keywords: sourcePkg.keywords,
    engines: sourcePkg.engines,
    publishConfig: { access: "public" },
    exports: sourcePkg.exports,
    files: ["dist"],
    bin: sourcePkg.bin,
    dependencies: sourcePkg.dependencies,
  };

  writeFileSync(join(dest, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  console.log(`Packed ${sourcePkg.name}@${sourcePkg.version} → ${dest}`);
  console.log(`Publish: cd ${dest} && npm publish --access public`);
}

main();
