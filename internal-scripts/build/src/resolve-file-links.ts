import fs from "node:fs/promises";
import path from "node:path";
import type { SkillLink } from "./parse-skill-md.js";

const ALLOWED_PREFIXES = ["/references/", "/scripts/", "/assets/"] as const;

function mapFileHref(href: string): { destRelative: string } {
  for (const prefix of ALLOWED_PREFIXES) {
    if (href.startsWith(prefix)) {
      return { destRelative: href.slice(1) };
    }
  }
  throw new Error(
    `Unknown in-package path prefix: ${href} (expected /references/, /scripts/, or /assets/)`,
  );
}

function rewriteLink(
  body: string,
  label: string,
  oldHref: string,
  newHref: string,
): string {
  return body.replace(`[${label}](${oldHref})`, `[${label}](${newHref})`);
}

export async function resolveFileLinks(
  body: string,
  links: SkillLink[],
  skillDir: string,
  outDir: string,
): Promise<string> {
  let result = body;

  for (const link of links) {
    if (!link.href.startsWith("/")) continue;

    const { destRelative } = mapFileHref(link.href);
    const sourcePath = path.join(skillDir, link.href.slice(1));
    const destPath = path.join(outDir, destRelative);

    try {
      await fs.access(sourcePath);
    } catch {
      throw new Error(`Linked file not found: ${link.href}`);
    }

    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(sourcePath, destPath);
    result = rewriteLink(result, link.label, link.href, destRelative);
  }

  return result;
}
