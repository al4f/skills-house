#!/usr/bin/env node

// src/layout-npm-skill.ts
import { cpSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
function npmPackageForSkill(name) {
  return `@skills-house/skill-${name}`;
}
function layoutDistFromNpmPackage(packageDir, skillName, workDir) {
  if (existsSync(join(packageDir, skillName, "SKILL.md"))) {
    return packageDir;
  }
  if (!existsSync(join(packageDir, "SKILL.md"))) {
    return null;
  }
  const distDir = join(workDir, "dist");
  const skillDir = join(distDir, skillName);
  mkdirSync(skillDir, { recursive: true });
  cpSync(packageDir, skillDir, { recursive: true });
  return distDir;
}

export {
  npmPackageForSkill,
  layoutDistFromNpmPackage
};
