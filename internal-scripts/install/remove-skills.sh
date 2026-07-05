#!/usr/bin/env bash
# Remove installed skills from agent skill directories.
#
# Usage:
#   remove-skills.sh [options]
#
# Options:
#   --agent <name>   Remove only from one agent: agents, codex, cursor, claude
#   --skill <name>   Remove only this skill (default: all from skills-dist)
#   --scope <scope>  global (default) or project
#   --all            Include test fixtures (e.g. minimal-skill)
#   --dry-run        Print actions without changing anything
#   --help           Show this help
#
# Examples:
#   ./remove-skills.sh
#   ./remove-skills.sh --scope project
#   ./remove-skills.sh --agent claude --skill skill-auditor

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=lib/resolve-repo-root.sh
source "$SCRIPT_DIR/lib/resolve-repo-root.sh"
REPO_ROOT="$(resolve_repo_root "$SCRIPT_DIR")"
DIST_DIR="${SKILLS_DIST_DIR:-$REPO_ROOT/skills-dist}"
# shellcheck source=lib/agent-targets.sh
source "$SCRIPT_DIR/lib/agent-targets.sh"

SCOPE="global"
AGENT_FILTER=""
SKILL_FILTER=""
DRY_RUN=false
INCLUDE_ALL=false

usage() {
  sed -n '3,18p' "$0" | sed 's/^# \?//'
}

log() { printf '%s\n' "$*"; }
run() {
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] $*"
  else
    "$@"
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)
      [[ $# -ge 2 ]] || { echo "Missing value for --agent" >&2; exit 1; }
      AGENT_FILTER="$2"
      shift 2
      ;;
    --skill)
      [[ $# -ge 2 ]] || { echo "Missing value for --skill" >&2; exit 1; }
      SKILL_FILTER="$2"
      shift 2
      ;;
    --scope)
      [[ $# -ge 2 ]] || { echo "Missing value for --scope" >&2; exit 1; }
      SCOPE="$2"
      shift 2
      ;;
    --all) INCLUDE_ALL=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

agents=()
if [[ -n "$AGENT_FILTER" ]]; then
  agents=("$AGENT_FILTER")
else
  agents=("${ALL_AGENTS[@]}")
fi

resolve_targets "$SCOPE" "$REPO_ROOT" "${agents[@]}" || exit 1

if [[ ${#TARGET_PATHS[@]} -eq 0 ]]; then
  echo "No remove targets resolved." >&2
  exit 1
fi

if [[ -n "$SKILL_FILTER" ]]; then
  skills=("$SKILL_FILTER")
elif [[ ! -d "$DIST_DIR" ]]; then
  echo "skills-dist/ not found at $DIST_DIR — pass --skill <name> to remove by name." >&2
  exit 1
else
  collect_dist_skills "$DIST_DIR" "$SKILL_FILTER" "$INCLUDE_ALL"
  skills=("${SKILLS_LIST[@]}")
fi

if [[ ${#skills[@]} -eq 0 ]]; then
  echo "No skills to remove." >&2
  exit 1
fi

log "Removing skills: ${skills[*]}"
log "Scope: $SCOPE"

removed=0
for i in "${!TARGET_PATHS[@]}"; do
  target_root="${TARGET_PATHS[$i]}"
  label="${TARGET_LABELS[$i]}"
  [[ -d "$target_root" ]] || continue
  log ""
  log "[$label] → $target_root"

  for skill in "${skills[@]}"; do
    dest="$target_root/$skill"
    if [[ -e "$dest" || -L "$dest" ]]; then
      run rm -rf "$dest"
      log "  ✓ removed $skill"
      removed=$((removed + 1))
    else
      log "  - $skill (not present)"
    fi
  done

  if [[ "$DRY_RUN" != true && -d "$target_root" ]]; then
    rmdir "$target_root" 2>/dev/null || true
    rmdir "$(dirname "$target_root")" 2>/dev/null || true
  fi
done

log ""
if [[ $removed -eq 0 ]]; then
  log "Nothing removed."
else
  log "Done."
fi
