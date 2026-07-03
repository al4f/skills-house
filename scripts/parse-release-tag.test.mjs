import assert from "node:assert/strict";
import { test } from "node:test";
import { parseReleaseTag } from "./parse-release-tag.mjs";

test("parseReleaseTag parses CLI tags", () => {
  assert.deepEqual(parseReleaseTag("v0.0.1-cli"), {
    type: "cli",
    version: "0.0.1",
  });
});

test("parseReleaseTag parses skill tags", () => {
  assert.deepEqual(parseReleaseTag("v0.1.0-skill-auditor"), {
    type: "skill",
    version: "0.1.0",
    skill: "skill-auditor",
  });
});

test("parseReleaseTag rejects invalid tags", () => {
  assert.equal(parseReleaseTag("v1.0.0"), null);
  assert.equal(parseReleaseTag("cli-v1.0.0"), null);
  assert.equal(parseReleaseTag("release-1.0.0"), null);
});
