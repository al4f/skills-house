## Manual review points

### Description triggers

Read the `description` as if you were the agent router. Would you load this skill for the right tasks? Vague descriptions cause missed activations or false positives.

### Context budget

Estimate how many tokens the expanded `SKILL.md` consumes on activation. If over ~200 lines, consider `@include` sections or moving detail to `references/`.

### Script safety

Scripts run in the user's environment. Flag anything that:

- Deletes files outside the project
- Exfiltrates data
- Installs packages without user awareness

### Cross-skill dependencies

If the skill references another skill package, confirm the dist output includes an install suggestion note — not a broken file copy.
