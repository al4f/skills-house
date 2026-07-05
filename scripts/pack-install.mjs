#!/usr/bin/env node
/**
 * Pack @skills-house/install into an npm-ready directory.
 *
 * Usage:
 *   node scripts/pack-install.mjs
 *   node scripts/pack-install.mjs --out packages/publish
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const INSTALL_SRC = join(REPO_ROOT, "internal-scripts", "install");
const DIST = join(INSTALL_SRC, "dist", "cli.js");

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
    console.error(`Install CLI dist not found: ${DIST} — run pnpm build first.`);
    process.exit(1);
  }

  const sourcePkg = JSON.parse(
    readFileSync(join(INSTALL_SRC, "package.json"), "utf-8"),
  );
  const dest = join(outDir, "install");

  mkdirSync(dest, { recursive: true });
  cpSync(join(INSTALL_SRC, "dist"), join(dest, "dist"), { recursive: true });

  mkdirSync(join(dest, "lib"), { recursive: true });
  cpSync(
    join(INSTALL_SRC, "install-skills.sh"),
    join(dest, "install-skills.sh"),
  );
  cpSync(
    join(INSTALL_SRC, "remove-skills.sh"),
    join(dest, "remove-skills.sh"),
  );
  cpSync(
    join(INSTALL_SRC, "lib", "agent-targets.sh"),
    join(dest, "lib", "agent-targets.sh"),
  );
  cpSync(join(INSTALL_SRC, "README.md"), join(dest, "README.md"));

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
    engines: { node: ">=20" },
    publishConfig: { access: "public" },
    files: sourcePkg.files,
    bin: sourcePkg.bin,
  };

  writeFileSync(join(dest, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  console.log(`Packed ${sourcePkg.name}@${sourcePkg.version} → ${dest}`);
  console.log(`Publish: cd ${dest} && npm publish --access public`);
}

main();
