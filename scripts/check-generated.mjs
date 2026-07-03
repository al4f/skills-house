#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";

const JSON_PATHS = [
  "generated/registry.json",
  "generated/search-index.json",
  "generated/dependency-graph.json",
  "website/data/registry.json",
  "website/data/search-index.json",
  "website/data/dependency-graph.json",
];

const OTHER_PATHS = [
  "website/skills",
  "website/scripts",
  "website/graph",
  "website/search",
  "website/platform",
  "website/platform.css",
];

function stripGeneratedAt(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const { generatedAt: _generatedAt, ...rest } = value;
  return rest;
}

let failed = false;

for (const filePath of JSON_PATHS) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing generated file: ${filePath}`);
    failed = true;
    continue;
  }

  const current = stripGeneratedAt(JSON.parse(fs.readFileSync(filePath, "utf8")));
  let committed;
  try {
    committed = stripGeneratedAt(
      JSON.parse(execSync(`git show HEAD:${filePath}`, { encoding: "utf8" })),
    );
  } catch {
    console.error(`Missing committed file: ${filePath}`);
    failed = true;
    continue;
  }

  if (JSON.stringify(current) !== JSON.stringify(committed)) {
    console.error(`Generated output mismatch: ${filePath}`);
    failed = true;
  }
}

try {
  execSync(`git diff --exit-code -- ${OTHER_PATHS.join(" ")}`, { stdio: "inherit" });
} catch {
  failed = true;
}

if (failed) process.exit(1);

console.log("OK: generated output matches committed artifacts.");
