import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts", "src/layout-npm-skill.ts", "src/paths.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
});
