export type ScriptRef = {
  package: string;
  export: string;
  label: string;
};

export type SkillEntry = {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  version: string;
  installCommand: string;
  scripts: ScriptRef[];
  dependencies: string[];
  relatedSkills: string[];
  examples: string[];
  sections: string[];
  references: string[];
  path: string;
  url: string;
};

export type ScriptExport = {
  key: string;
  path: string;
  description: string;
};

export type ScriptEntry = {
  id: string;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  exports: ScriptExport[];
  skillsUsing: string[];
  maintainers: string[];
  examples: string[];
  path: string;
  url: string;
};

export type Registry = {
  generatedAt: string;
  repository: string;
  skills: SkillEntry[];
  scripts: ScriptEntry[];
};

export const BRAND = {
  site: "Skills House",
  author: "al4f",
  authorUrl: "https://al4f.dev",
  repo: "https://github.com/al4f/skills-house",
  docs: "https://github.com/al4f/skills-house/tree/main/specs",
} as const;
