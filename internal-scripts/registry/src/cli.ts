#!/usr/bin/env node
import { generateRegistry } from "./generate.js";

const args = process.argv.slice(2);
const skipValidation = args.includes("--skip-validation");
const websiteOnly = args.includes("--website-only");

try {
  const registry = await generateRegistry({ skipValidation, websiteOnly });
  console.log(`Generated registry: ${registry.skills.length} skills, ${registry.scripts.length} scripts.`);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
