const PROJECT_NAME_RE = /^[a-z][a-z0-9-]*$/;

export function validateProjectName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Project name is required.");
  }
  if (!PROJECT_NAME_RE.test(trimmed)) {
    throw new Error(
      `Invalid project name "${trimmed}". Use lowercase letters, numbers, and hyphens; start with a letter.`,
    );
  }
  if (trimmed.endsWith("-")) {
    throw new Error(`Invalid project name "${trimmed}". Cannot end with a hyphen.`);
  }
  return trimmed;
}

export function validateSkillName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Skill name is required.");
  }
  if (!PROJECT_NAME_RE.test(trimmed)) {
    throw new Error(
      `Invalid skill name "${trimmed}". Use lowercase letters, numbers, and hyphens; start with a letter.`,
    );
  }
  if (trimmed.endsWith("-")) {
    throw new Error(`Invalid skill name "${trimmed}". Cannot end with a hyphen.`);
  }
  return trimmed;
}

export function defaultSkillName(projectName: string): string {
  if (projectName === ".") {
    return "my-skill";
  }
  return projectName.includes("-")
    ? projectName
    : `${projectName}-skill`;
}
