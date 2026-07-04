#!/usr/bin/env node
import {
  layoutDistFromNpmPackage,
  npmPackageForSkill
} from "./chunk-657X6XYS.js";
import {
  defaultRepoRoot,
  monorepoDistDir,
  resolveInstallScript
} from "./chunk-DHUBBM23.js";

// src/cli.ts
import { spawnSync } from "child_process";
import { existsSync, mkdtempSync, readdirSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
function usage() {
  console.log(`@skills-house/install \u2014 install Agent Skills from dist

Usage:
  install-skills add <name> [options]

Options:
  --agent <name>     agents | codex | cursor | claude
  --scope <scope>    global (default) | project
  --from <path>      Install from a local dist directory
  --copy             Copy files instead of symlinking
  --dry-run          Preview without installing
  --help             Show this help

Examples:
  install-skills add skill-auditor
  install-skills add skill-auditor --agent cursor --scope project
  install-skills add skill-auditor --from ./skills-dist
  pnpm install:skills --scope project --skill skill-auditor

Consumer distribution (skills.sh):
  npx skills add al4f/skills-house --skill skill-auditor
`);
}
function parseArgs(argv) {
  const rest = argv.slice(2);
  if (rest.length === 0 || rest[0] === "--help" || rest[0] === "-h") {
    usage();
    return null;
  }
  return { command: rest[0], args: rest.slice(1) };
}
function parseAddArgs(args) {
  if (args.length === 0 || args[0] === "--help") {
    usage();
    return null;
  }
  const options = {
    skill: args[0],
    scope: "global",
    copy: false,
    dryRun: false
  };
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--agent":
        options.agent = args[++i];
        break;
      case "--scope":
        options.scope = args[++i];
        break;
      case "--from":
        options.from = resolve(args[++i]);
        break;
      case "--copy":
        options.copy = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        usage();
        return null;
    }
  }
  return options;
}
function tryInstallFromNpm(name, targetDir) {
  const pkg = npmPackageForSkill(name);
  const pack = spawnSync("npm", ["pack", pkg, "--pack-destination", targetDir], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (pack.status !== 0) {
    return null;
  }
  const tarball = pack.stdout.trim().split("\n").map((line) => line.trim()).filter(Boolean).pop();
  if (!tarball) return null;
  const extract = spawnSync("tar", ["-xzf", join(targetDir, tarball), "-C", targetDir], {
    stdio: "inherit"
  });
  if (extract.status !== 0) {
    return null;
  }
  const entries = readdirSync(targetDir, { withFileTypes: true });
  const packageDir = entries.find((e) => e.isDirectory() && e.name === "package");
  if (packageDir) {
    return join(targetDir, "package");
  }
  if (existsSync(join(targetDir, "SKILL.md"))) {
    return targetDir;
  }
  return null;
}
function resolveDistDir(options) {
  if (options.from) {
    return options.from;
  }
  const monorepoDist = monorepoDistDir();
  if (existsSync(join(monorepoDist, options.skill, "SKILL.md"))) {
    return monorepoDist;
  }
  const tempRoot = mkdtempSync(join(tmpdir(), "skills-house-"));
  const extracted = tryInstallFromNpm(options.skill, tempRoot);
  if (extracted) {
    const distDir = layoutDistFromNpmPackage(
      extracted,
      options.skill,
      tempRoot
    );
    if (distDir) {
      return distDir;
    }
  }
  console.error(`Could not find skill "${options.skill}".`);
  console.error("");
  console.error("Options:");
  console.error(
    `  \u2022 Clone skills-house and run: pnpm build && install-skills add ${options.skill} --from ./skills-dist`
  );
  console.error(`  \u2022 npx skills add al4f/skills-house --skill ${options.skill}`);
  console.error(`  \u2022 npm package: ${npmPackageForSkill(options.skill)}`);
  process.exit(1);
}
function runInstall(distDir, options) {
  const installScript = resolveInstallScript();
  if (!installScript) {
    console.error("install-skills.sh not found in @skills-house/install package.");
    process.exit(1);
  }
  const installArgs = [
    installScript,
    "--skill",
    options.skill,
    "--scope",
    options.scope
  ];
  if (options.agent) {
    installArgs.push("--agent", options.agent);
  }
  if (options.copy) {
    installArgs.push("--copy");
  }
  if (options.dryRun) {
    installArgs.push("--dry-run");
  }
  const repoRoot = defaultRepoRoot();
  const env = {
    ...process.env,
    SKILLS_DIST_DIR: distDir,
    SKILLS_REPO_ROOT: options.scope === "project" ? process.cwd() : repoRoot
  };
  const result = spawnSync("bash", installArgs, {
    env,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  console.log("");
  console.log("Learn more: https://al4f.dev");
}
function addCommand(args) {
  const options = parseAddArgs(args);
  if (!options) return;
  const distDir = resolveDistDir(options);
  if (!existsSync(join(distDir, options.skill, "SKILL.md"))) {
    console.error(`Skill not found in dist: ${join(distDir, options.skill)}`);
    process.exit(1);
  }
  runInstall(distDir, options);
}
function main() {
  const parsed = parseArgs(process.argv);
  if (!parsed) return;
  if (parsed.command === "add") {
    addCommand(parsed.args);
    return;
  }
  console.error(`Unknown command: ${parsed.command}`);
  usage();
  process.exit(1);
}
main();
