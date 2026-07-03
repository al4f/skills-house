#!/usr/bin/env bash
# Install built skills from skills-dist/ into agent skill directories.
#
# Usage:
#   install-skills.sh [options]
#
# Options:
#   --agent <name>   Install only for one agent: agents, codex, cursor, claude
#   --skill <name>   Install only this skill (default: all except minimal-skill)
#   --scope <scope>  global (default) or project
#   --copy           Copy files instead of symlinking
#   --all            Include test fixtures (e.g. minimal-skill)
#   --dry-run        Print actions without changing anything
#   --help           Show this help
#
# Examples:
#   ./install-skills.sh
#   ./install-skills.sh --agent cursor
#   ./install-skills.sh --scope project
#   ./install-skills.sh --agent codex --skill skill-auditor --copy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="${SKILLS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
DIST_DIR="${SKILLS_DIST_DIR:-$REPO_ROOT/skills-dist}"
# shellcheck source=lib/agent-targets.sh
source "$SCRIPT_DIR/lib/agent-targets.sh"

SCOPE="global"
MODE="symlink"
AGENT_FILTER=""
SKILL_FILTER=""
DRY_RUN=false
INCLUDE_ALL=false

usage() {
  sed -n '3,21p' "$0" | sed 's/^# \?//'
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
    --copy) MODE="copy"; shift ;;
    --all) INCLUDE_ALL=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ ! -d "$DIST_DIR" ]]; then
  echo "skills-dist/ not found at $DIST_DIR — run pnpm build first." >&2
  exit 1
fi

agents=()
if [[ -n "$AGENT_FILTER" ]]; then
  agents=("$AGENT_FILTER")
else
  agents=("${ALL_AGENTS[@]}")
fi

resolve_targets "$SCOPE" "$REPO_ROOT" "${agents[@]}" || exit 1

if [[ ${#TARGET_PATHS[@]} -eq 0 ]]; then
  echo "No install targets resolved." >&2
  exit 1
fi

collect_dist_skills "$DIST_DIR" "$SKILL_FILTER" "$INCLUDE_ALL"
skills=("${SKILLS_LIST[@]}")

if [[ ${#skills[@]} -eq 0 ]]; then
  echo "No skills to install in $DIST_DIR" >&2
  exit 1
fi

log "Installing from: $DIST_DIR"
log "Skills: ${skills[*]}"
log "Mode: $MODE | Scope: $SCOPE"

for i in "${!TARGET_PATHS[@]}"; do
  target_root="${TARGET_PATHS[$i]}"
  label="${TARGET_LABELS[$i]}"
  run mkdir -p "$target_root"
  log ""
  log "[$label] → $target_root"

  for skill in "${skills[@]}"; do
    src="$DIST_DIR/$skill"
    dest="$target_root/$skill"

    if [[ -e "$dest" || -L "$dest" ]]; then
      run rm -rf "$dest"
    fi

    if [[ "$MODE" == "symlink" ]]; then
      run ln -s "$src" "$dest"
      log "  ✓ $skill (symlink)"
    else
      run cp -R "$src" "$dest"
      log "  ✓ $skill (copy)"
    fi
  done
done

log ""
log "Done."
