export type FrameworkCommand = {
  label: string;
  code: string;
  desc: string;
};

export const FRAMEWORK_COMMANDS: FrameworkCommand[] = [
  {
    label: "Create",
    code: "npx @skills-house/create my-app",
    desc: "Scaffold a new project with build + install tooling.",
  },
  {
    label: "Build",
    code: "npx @skills-house/build skills/my-skill",
    desc: "Compile skill source to spec-compliant dist.",
  },
  {
    label: "Install",
    code: "npx @skills-house/install add my-skill --agent cursor",
    desc: "Wire built skills into Cursor, Claude, Codex, and more.",
  },
];
