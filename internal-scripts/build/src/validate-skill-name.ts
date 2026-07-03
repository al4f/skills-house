import path from "node:path";

export function validateSkillName(
  frontmatter: Record<string, unknown>,
  skillDir: string,
): string {
  const dirName = path.basename(path.resolve(skillDir));
  const name =
    typeof frontmatter.name === "string" ? frontmatter.name.trim() : "";

  if (!name) {
    throw new Error(
      `SKILL.md: missing required frontmatter "name" (directory: ${dirName})`,
    );
  }

  if (name !== dirName) {
    throw new Error(
      `SKILL.md: frontmatter name "${name}" must match directory "${dirName}"`,
    );
  }

  return name;
}
