import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDependencyGraph, scanScripts, scanSkills } from "../dist/lib.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("scanSkills finds skill-auditor", async () => {
  const skills = await scanSkills(repoRoot, "al4f");
  const auditor = skills.find((s) => s.id === "skill-auditor");
  assert.ok(auditor);
  assert.equal(auditor.author, "al4f");
  assert.ok(auditor.tags.includes("validation"));
  assert.ok(auditor.scripts.some((s) => s.package === "skill-auditor-tools"));
});

test("scanScripts links skills using script", async () => {
  const skills = await scanSkills(repoRoot, "al4f");
  const scripts = await scanScripts(repoRoot, skills, "al4f");
  const tools = scripts.find((s) => s.id === "skill-auditor-tools");
  assert.ok(tools);
  assert.ok(tools.skillsUsing.includes("skill-auditor"));
  assert.ok(tools.inputs.length > 0);
});

test("buildDependencyGraph is bidirectional", async () => {
  const skills = await scanSkills(repoRoot, "al4f");
  const graph = buildDependencyGraph(skills);
  assert.ok(graph.skillsToScripts["skill-auditor"]?.includes("skill-auditor-tools"));
  assert.ok(graph.scriptsToSkills["skill-auditor-tools"]?.includes("skill-auditor"));
});
