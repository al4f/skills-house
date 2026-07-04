#!/usr/bin/env node
/**
 * Parse release tags for npm publish workflow.
 *
 * Formats:
 *   v0.0.1-build          → @skills-house/build
 *   v0.0.1-cli            → @skills-house/cli
 *   v0.0.1-create        → @skills-house/create
 *   v0.0.1-skill-auditor → @skills-house/skill-skill-auditor
 *
 * Usage:
 *   node scripts/parse-release-tag.mjs v0.0.1-cli
 */

import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

/**
 * @param {string} tag
 * @returns {{ type: "build", version: string } | { type: "cli", version: string } | { type: "create", version: string } | { type: "skill", version: string, skill: string } | null}
 */
export function parseReleaseTag(tag) {
  const match = tag.match(/^v(\d+\.\d+\.\d+)-(.+)$/);
  if (!match) {
    return null;
  }

  const version = match[1];
  const target = match[2];

  if (target === "build") {
    return { type: "build", version };
  }

  if (target === "cli") {
    return { type: "cli", version };
  }

  if (target === "create") {
    return { type: "create", version };
  }

  return { type: "skill", version, skill: target };
}

function main() {
  const tag = process.argv[2];
  if (!tag) {
    console.error("Usage: node scripts/parse-release-tag.mjs <tag>");
    process.exit(1);
  }

  const parsed = parseReleaseTag(tag);
  if (!parsed) {
    console.error(`Invalid release tag: ${tag}`);
    console.error("Expected v<semver>-build, v<semver>-cli, v<semver>-create, or v<semver>-<skill-name>");
    process.exit(1);
  }

  console.log(JSON.stringify(parsed));
}

if (process.argv[1] === __filename) {
  main();
}
