import fs from "node:fs/promises";
import path from "node:path";

const INCLUDE_LINE_RE = /^@include\s+(\/[^\s]+)\s*$/gm;

export async function resolveIncludes(
  body: string,
  skillDir: string,
): Promise<string> {
  const matches = [...body.matchAll(INCLUDE_LINE_RE)];
  let result = body;

  for (const match of matches) {
    const includePath = match[1];
    const sourcePath = path.join(skillDir, includePath.slice(1));
    let content: string;
    try {
      content = await fs.readFile(sourcePath, "utf-8");
    } catch {
      throw new Error(`@include file not found: ${includePath}`);
    }
    result = result.replace(match[0], content.trimEnd() + "\n");
  }

  return result;
}
