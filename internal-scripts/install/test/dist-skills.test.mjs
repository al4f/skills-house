import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isGlobPattern,
  listDistSkills,
  skillMatchesFilter,
} from "../dist/dist-skills.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const DIST = join(REPO_ROOT, "skills-dist");

test("skillMatchesFilter exact and glob", () => {
  assert.equal(skillMatchesFilter("skill-auditor", "skill-auditor"), true);
  assert.equal(skillMatchesFilter("skill-auditor", "other"), false);
  assert.equal(skillMatchesFilter("skills-house-build", "skills-house-*"), true);
  assert.equal(skillMatchesFilter("skill-auditor", "skills-house-*"), false);
  assert.equal(isGlobPattern("skills-house-*"), true);
  assert.equal(isGlobPattern("skill-auditor"), false);
});

test("listDistSkills filters by glob", () => {
  const all = listDistSkills(DIST);
  assert.ok(all.includes("skill-auditor"));

  const productSkills = listDistSkills(DIST, { filter: "skills-house-*" });
  assert.ok(productSkills.length >= 3);
  assert.ok(productSkills.every((name) => name.startsWith("skills-house-")));
});
