import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  isGlobPattern,
  listDistSkills,
} from "./dist-skills.js";
import {
  layoutDistFromNpmPackage,
  npmPackageForSkill,
} from "./layout-npm-skill.js";
import {
  defaultRepoRoot,
  monorepoDistDir,
  resolveInstallScript,
} from "./paths.js";

type AddOptions = {
  skill: string;
  agent?: string;
  scope: "global" | "project";
  copy: boolean;
  from?: string;
  dryRun: boolean;
};

type ListOptions = {
  from?: string;
  skill?: string;
  includeAll: boolean;
};

function usage(): void {
  console.log(`@skills-house/install — install Agent Skills from dist

Usage:
  install-skills add <name|pattern> [options]
  install-skills list [options]

Commands:
  add              Install skill(s) from dist (name or glob pattern)
  list             List skills available in dist

Options (add):
  --agent <name>     agents | codex | cursor | claude (default: all)
  --scope <scope>    global (default) | project
  --from <path>      Install from a local dist directory
  --copy             Copy files instead of symlinking
  --dry-run          Preview without installing

Options (list):
  --from <path>      Dist directory (default: ./skills-dist)
  --skill <pattern>  Filter by name or glob (e.g. skills-house-*)
  --all              Include test fixtures (e.g. minimal-skill)

Examples:
  install-skills add skill-auditor
  install-skills add 'skills-house-*' --agent cursor --scope project
  install-skills add skill-auditor --from ./skills-dist
  install-skills list --from ./skills-dist
  install-skills list --skill 'skill-*'

Consumer distribution (skills.sh):
  npx skills add al4f/skills-house --skill skill-auditor
`);
}

function parseArgs(argv: string[]): { command: string; args: string[] } | null {
  const rest = argv.slice(2);
  if (rest.length === 0 || rest[0] === "--help" || rest[0] === "-h") {
    usage();
    return null;
  }
  return { command: rest[0], args: rest.slice(1) };
}

function parseAddArgs(args: string[]): AddOptions | null {
  if (args.length === 0 || args[0] === "--help") {
    usage();
    return null;
  }

  const options: AddOptions = {
    skill: args[0],
    scope: "global",
    copy: false,
    dryRun: false,
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--agent":
        options.agent = args[++i];
        break;
      case "--scope":
        options.scope = args[++i] as AddOptions["scope"];
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

function parseListArgs(args: string[]): ListOptions | null {
  if (args.includes("--help")) {
    usage();
    return null;
  }

  const options: ListOptions = { includeAll: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--from":
        options.from = resolve(args[++i]);
        break;
      case "--skill":
        options.skill = args[++i];
        break;
      case "--all":
        options.includeAll = true;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        usage();
        return null;
    }
  }

  return options;
}

function tryInstallFromNpm(name: string, targetDir: string): string | null {
  const pkg = npmPackageForSkill(name);
  const pack = spawnSync("npm", ["pack", pkg, "--pack-destination", targetDir], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (pack.status !== 0) {
    return null;
  }

  const tarball = pack.stdout
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();

  if (!tarball) return null;

  const extract = spawnSync("tar", ["-xzf", join(targetDir, tarball), "-C", targetDir], {
    stdio: "inherit",
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

function resolveDistDirForAdd(options: AddOptions): string {
  if (options.from) {
    return options.from;
  }

  const monorepoDist = monorepoDistDir();
  const matches = listDistSkills(monorepoDist, { filter: options.skill });
  if (matches.length > 0) {
    return monorepoDist;
  }

  if (isGlobPattern(options.skill)) {
    failSkillNotFound(options.skill);
  }

  const tempRoot = mkdtempSync(join(tmpdir(), "skills-house-"));
  const extracted = tryInstallFromNpm(options.skill, tempRoot);
  if (extracted) {
    const distDir = layoutDistFromNpmPackage(
      extracted,
      options.skill,
      tempRoot,
    );
    if (distDir) {
      return distDir;
    }
  }

  failSkillNotFound(options.skill);
}

function resolveDistDirForList(options: ListOptions): string {
  if (options.from) {
    return options.from;
  }

  const monorepoDist = monorepoDistDir();
  if (existsSync(monorepoDist)) {
    return monorepoDist;
  }

  const cwdDist = resolve(process.cwd(), "skills-dist");
  if (existsSync(cwdDist)) {
    return cwdDist;
  }

  console.error("Could not find skills-dist/. Use --from <path>.");
  process.exit(1);
}

function failSkillNotFound(skill: string): never {
  console.error(`Could not find skill "${skill}".`);
  console.error("");
  console.error("Options:");
  console.error(
    `  • Clone skills-house and run: pnpm build && install-skills add ${skill} --from ./skills-dist`,
  );
  console.error(`  • npx skills add al4f/skills-house --skill ${skill}`);
  if (!isGlobPattern(skill)) {
    console.error(`  • npm package: ${npmPackageForSkill(skill)}`);
  }
  process.exit(1);
}

function runInstall(distDir: string, options: AddOptions): void {
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
    options.scope,
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
    SKILLS_REPO_ROOT: options.scope === "project" ? process.cwd() : repoRoot,
  };

  const result = spawnSync("bash", installArgs, {
    env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log("");
  console.log("Learn more: https://al4f.dev");
}

function addCommand(args: string[]): void {
  const options = parseAddArgs(args);
  if (!options) return;

  const distDir = resolveDistDirForAdd(options);
  const matches = listDistSkills(distDir, { filter: options.skill });

  if (matches.length === 0) {
    console.error(`No skills match "${options.skill}" in ${distDir}`);
    process.exit(1);
  }

  runInstall(distDir, options);
}

function listCommand(args: string[]): void {
  const options = parseListArgs(args);
  if (!options) return;

  const distDir = resolveDistDirForList(options);
  if (!existsSync(distDir)) {
    console.error(`Dist directory not found: ${distDir}`);
    process.exit(1);
  }

  const skills = listDistSkills(distDir, {
    filter: options.skill,
    includeAll: options.includeAll,
  });

  if (skills.length === 0) {
    console.error(`No skills found in ${distDir}`);
    process.exit(1);
  }

  for (const skill of skills) {
    console.log(skill);
  }
}

function main(): void {
  const parsed = parseArgs(process.argv);
  if (!parsed) return;

  if (parsed.command === "add") {
    addCommand(parsed.args);
    return;
  }

  if (parsed.command === "list") {
    listCommand(parsed.args);
    return;
  }

  console.error(`Unknown command: ${parsed.command}`);
  usage();
  process.exit(1);
}

main();
