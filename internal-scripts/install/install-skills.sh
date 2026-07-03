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
#   ./install-skills.sh --agent codex --skill brainstorming --copy

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DIST_DIR="$REPO_ROOT/skills-dist"

SCOPE="global"
MODE="symlink"
AGENT_FILTER=""
SKILL_FILTER=""
DRY_RUN=false
INCLUDE_ALL=false

usage() {
  sed -n '3,19p' "$0" | sed 's/^# \?//'
}

log() { printf '%s\n' "$*"; }
run() {
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] $*"
  else
    "$@"
  fi
}

agent_dir() {
  local agent="$1"
  case "$SCOPE" in
    global)
      case "$agent" in
        agents) printf '%s' "$HOME/.agents/skills" ;;
        codex)  printf '%s' "$HOME/.codex/skills" ;;
        cursor) printf '%s' "$HOME/.cursor/skills" ;;
        claude) printf '%s' "$HOME/.claude/skills" ;;
        *) echo "Unknown agent: $agent" >&2; return 1 ;;
      esac
      ;;
    project)
      case "$agent" in
        agents) printf '%s' "$REPO_ROOT/.agents/skills" ;;
        cursor) printf '%s' "$REPO_ROOT/.cursor/skills" ;;
        claude) printf '%s' "$REPO_ROOT/.claude/skills" ;;
        codex)
          echo "Codex project skills use .agents/skills (open standard). Use --agent agents with --scope project." >&2
          return 1
          ;;
        *) echo "Unknown agent: $agent" >&2; return 1 ;;
      esac
      ;;
    *)
      echo "Unknown scope: $SCOPE" >&2
      return 1
      ;;
  esac
}

ALL_AGENTS=(agents codex cursor claude)

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

skills=()
for dir in "$DIST_DIR"/*; do
  [[ -d "$dir" ]] || continue
  name="$(basename "$dir")"
  [[ -f "$dir/SKILL.md" ]] || continue
  if [[ "$INCLUDE_ALL" != true && "$name" == "minimal-skill" ]]; then
    continue
  fi
  if [[ -n "$SKILL_FILTER" && "$name" != "$SKILL_FILTER" ]]; then
    continue
  fi
  skills+=("$name")
done

if [[ ${#skills[@]} -eq 0 ]]; then
  echo "No skills to install in $DIST_DIR" >&2
  exit 1
fi

log "Installing from: $DIST_DIR"
log "Skills: ${skills[*]}"
log "Mode: $MODE | Scope: $SCOPE"

for agent in "${agents[@]}"; do
  target_root="$(agent_dir "$agent")" || exit 1
  run mkdir -p "$target_root"
  log ""
  log "[$agent] → $target_root"

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
