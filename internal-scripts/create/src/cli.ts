import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";
import {
  packageRootFromImportMeta,
  resolveTemplateRoot,
  scaffoldProject,
} from "./scaffold.js";
import {
  defaultSkillName,
  validateProjectName,
  validateSkillName,
} from "./validate.js";

type CliOptions = {
  targetDir: string;
  projectName: string;
  skillName: string;
  install: boolean;
};

function usage(): void {
  console.log(`create-skills-house — scaffold an agentic skill-based app

Usage:
  npx create-skills-house <project-directory> [options]

Options:
  --skill <name>     Starter skill directory name (default: derived from project)
  --no-install       Skip pnpm install after scaffolding
  --help             Show this help

Examples:
  npx create-skills-house my-app
  npx create-skills-house my-app --skill onboarding
  npx create-skills-house .

Learn more: https://al4f.dev
`);
}

function parseArgs(argv: string[]): CliOptions | null {
  const rest = argv.slice(2);

  if (rest.length === 0 || rest.includes("--help") || rest.includes("-h")) {
    usage();
    return null;
  }

  let targetDir = rest[0];
  let skillName: string | undefined;
  let install = true;

  for (let i = 1; i < rest.length; i++) {
    const arg = rest[i];
    switch (arg) {
      case "--skill":
        skillName = rest[++i];
        break;
      case "--no-install":
        install = false;
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        usage();
        return null;
    }
  }

  const resolvedTarget = resolve(process.cwd(), targetDir);
  const projectName =
    targetDir === "."
      ? basename(resolvedTarget)
      : validateProjectName(basename(resolvedTarget));

  const finalSkillName = validateSkillName(
    skillName ?? defaultSkillName(projectName),
  );

  return {
    targetDir: resolvedTarget,
    projectName,
    skillName: finalSkillName,
    install,
  };
}

function commandExists(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return result.status === 0;
}

function runInstall(targetDir: string): void {
  if (commandExists("pnpm")) {
    const result = spawnSync("pnpm", ["install"], {
      cwd: targetDir,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
    return;
  }

  console.warn("pnpm not found — run `pnpm install` in the project directory.");
}

function printNextSteps(
  targetDir: string,
  projectName: string,
  skillName: string,
  installed: boolean,
): void {
  const relativeDir =
    targetDir === process.cwd() ? "." : basename(targetDir);

  console.log("");
  console.log(`Created ${projectName} at ${targetDir}`);
  console.log(`Starter skill: skills/${skillName}/`);
  console.log("");
  console.log("Next steps:");
  if (relativeDir !== ".") {
    console.log(`  cd ${relativeDir}`);
  }
  if (!installed) {
    console.log("  pnpm install");
  }
  console.log("  pnpm build");
  console.log("  pnpm dev          # build + install skills to this project");
  console.log("");
  console.log("Docs: https://al4f.dev");
}

function main(): void {
  try {
    const options = parseArgs(process.argv);
    if (!options) return;

    const packageRoot = packageRootFromImportMeta(import.meta.url);
    const templateRoot = resolveTemplateRoot(packageRoot);

    scaffoldProject({
      targetDir: options.targetDir,
      projectName: options.projectName,
      skillName: options.skillName,
      templateRoot,
    });

    let installed = false;
    if (options.install) {
      runInstall(options.targetDir);
      installed = existsSync(resolve(options.targetDir, "node_modules"));
    }

    printNextSteps(
      options.targetDir,
      options.projectName,
      options.skillName,
      installed,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

main();
