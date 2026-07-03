import fs from "node:fs/promises";
import path from "node:path";

const INCLUDE_LINE_RE = /^@include\s+(\/[^\s]+)\s*$/gm;

export async function resolveIncludes(
  body: string,
  skillDir: string,
): Promise<string> {
  return resolveIncludesInBody(body, skillDir, []);
}

async function resolveIncludesInBody(
  body: string,
  skillDir: string,
  stack: string[],
): Promise<string> {
  const matches = [...body.matchAll(INCLUDE_LINE_RE)];
  if (matches.length === 0) {
    return body;
  }

  let result = body;

  for (const match of matches) {
    const includePath = match[1];

    if (stack.includes(includePath)) {
      const chain = [...stack, includePath].join(" → ");
      throw new Error(`@include cycle detected: ${chain}`);
    }

    const sourcePath = path.join(skillDir, includePath.slice(1));
    let content: string;
    try {
      content = await fs.readFile(sourcePath, "utf-8");
    } catch {
      throw new Error(`@include file not found: ${includePath}`);
    }

    const expanded = await resolveIncludesInBody(content, skillDir, [
      ...stack,
      includePath,
    ]);
    result = result.replace(match[0], expanded.trimEnd() + "\n");
  }

  return result;
}
