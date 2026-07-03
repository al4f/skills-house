#!/usr/bin/env bash
# Validate a skill directory against Agent Skills conventions.
# Usage: validate.sh <skill-dir>
set -euo pipefail

SKILL_DIR="${1:-.}"
SKILL_MD="${SKILL_DIR}/SKILL.md"
ERRORS=0

err() { echo "ERROR: $*" >&2; ERRORS=$((ERRORS + 1)); }
warn() { echo "WARN: $*" >&2; }

if [[ ! -f "$SKILL_MD" ]]; then
  err "Missing SKILL.md in $SKILL_DIR"
  exit 1
fi

DIR_NAME="$(basename "$(cd "$SKILL_DIR" && pwd)")"

# Extract frontmatter name
FM_NAME="$(awk '/^---$/{c++; if(c==1)next; if(c==2)exit} c==1 && /^name:/{sub(/^name:[[:space:]]*/,""); gsub(/^["'\'']|["'\'']$/,""); print; exit}' "$SKILL_MD")"

if [[ -z "$FM_NAME" ]]; then
  err "Missing frontmatter 'name' in SKILL.md"
else
  if [[ "$FM_NAME" != "$DIR_NAME" ]]; then
    err "Frontmatter name '$FM_NAME' does not match directory '$DIR_NAME'"
  fi
fi

# Extract description
FM_DESC="$(awk '/^---$/{c++; if(c==1)next; if(c==2)exit} c==1 && /^description:/{sub(/^description:[[:space:]]*/,""); gsub(/^["'\'']|["'\'']$/,""); print; exit}' "$SKILL_MD")"
if [[ -z "$FM_DESC" ]]; then
  err "Missing frontmatter 'description' in SKILL.md"
elif [[ ${#FM_DESC} -lt 20 ]]; then
  warn "Description is very short (${#FM_DESC} chars) — agents use this to decide when to load the skill"
fi

# Check for body content after frontmatter
BODY_LINES="$(awk '/^---$/{c++; next} c>=2' "$SKILL_MD" | grep -c . || true)"
if [[ "$BODY_LINES" -lt 3 ]]; then
  warn "SKILL.md body looks very short"
fi

# Check in-package link targets (paths starting with /)
while IFS= read -r ref; do
  [[ -z "$ref" ]] && continue
  target="${SKILL_DIR}${ref}"
  if [[ ! -e "$target" ]]; then
    err "Broken in-package link: $ref (resolved to $target)"
  fi
done < <(grep -oE '\]\(/[^)]+\)' "$SKILL_MD" 2>/dev/null | sed 's/^](//;s/)$//' || true)

if [[ $ERRORS -gt 0 ]]; then
  echo "Validation failed with $ERRORS error(s)." >&2
  exit 1
fi

echo "OK: $DIR_NAME passed basic Agent Skills checks."
