# Shared agent install/remove target resolution.
# Source from install-skills.sh and remove-skills.sh.

ALL_AGENTS=(agents codex cursor claude)
TARGET_PATHS=()
TARGET_LABELS=()

add_target() {
  local label="$1"
  local path="$2"
  local existing
  for existing in "${TARGET_PATHS[@]:-}"; do
    [[ "$existing" == "$path" ]] && return
  done
  TARGET_PATHS+=("$path")
  TARGET_LABELS+=("$label")
}

resolve_agent_targets() {
  local agent="$1"
  local scope="$2"
  local repo_root="$3"
  case "$scope" in
    global)
      case "$agent" in
        agents) add_target "agents" "$HOME/.agents/skills" ;;
        codex)  add_target "codex" "$HOME/.codex/skills" ;;
        cursor) add_target "cursor" "$HOME/.cursor/skills" ;;
        claude) add_target "claude" "$HOME/.claude/skills" ;;
        *) echo "Unknown agent: $agent" >&2; return 1 ;;
      esac
      ;;
    project)
      case "$agent" in
        agents) add_target "agents (project)" "$repo_root/.agents/skills" ;;
        codex)
          add_target "codex → .agents/skills (project)" "$repo_root/.agents/skills"
          ;;
        cursor)
          add_target "cursor → .agents/skills (project)" "$repo_root/.agents/skills"
          add_target "cursor (project)" "$repo_root/.cursor/skills"
          ;;
        claude) add_target "claude (project)" "$repo_root/.claude/skills" ;;
        *) echo "Unknown agent: $agent" >&2; return 1 ;;
      esac
      ;;
    *)
      echo "Unknown scope: $scope" >&2
      return 1
      ;;
  esac
}

resolve_targets() {
  local scope="$1"
  local repo_root="$2"
  shift 2
  local agents=("$@")
  TARGET_PATHS=()
  TARGET_LABELS=()
  local agent
  for agent in "${agents[@]}"; do
    resolve_agent_targets "$agent" "$scope" "$repo_root" || return 1
  done
}

list_dist_skills() {
  local dist_dir="$1"
  local skill_filter="$2"
  local include_all="$3"
  local dir name
  for dir in "$dist_dir"/*; do
    [[ -d "$dir" ]] || continue
    name="$(basename "$dir")"
    [[ -f "$dir/SKILL.md" ]] || continue
    if [[ "$include_all" != true && "$name" == "minimal-skill" ]]; then
      continue
    fi
    if [[ -n "$skill_filter" && "$name" != "$skill_filter" ]]; then
      continue
    fi
    printf '%s\n' "$name"
  done
}

SKILLS_LIST=()

collect_dist_skills() {
  local dist_dir="$1"
  local skill_filter="$2"
  local include_all="$3"
  local name
  SKILLS_LIST=()
  while IFS= read -r name; do
    [[ -n "$name" ]] && SKILLS_LIST+=("$name")
  done < <(list_dist_skills "$dist_dir" "$skill_filter" "$include_all")
}
