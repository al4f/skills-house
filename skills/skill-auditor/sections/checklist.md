## Audit checklist

1. **Frontmatter** — `name` and `description` present; `name` matches directory
2. **Description quality** — explains what the skill does AND when to activate it
3. **Body structure** — headings, progressive disclosure; avoid one giant wall of text
4. **Links** — in-package paths use root-absolute hrefs (`/references/foo.md`)
5. **Scripts** — executable files in `scripts/` or referenced from shared packages
6. **Dist layout** — after build: `SKILL.md`, optional `references/`, `scripts/`, `assets/`
7. **No secrets** — no API keys, tokens, or credentials in skill files

Report findings as a short table: **check | status | notes**.
