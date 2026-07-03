#!/usr/bin/env bash
# skills.sh — install Agent Skills from npm into agent directories
#
# Usage:
#   skills.sh add <name> [options]
#   skills.sh remove <name> [options]
#
# Options (passed to install/remove):
#   --agent <name>     agents | codex | cursor | claude
#   --scope <scope>    global (default) | project
#   --from <path>      Install from a local skills-dist directory (add only)
#   --copy             Copy files instead of symlinking (add only)
#   --dry-run          Preview without changing anything
#   --help             Show this help
#
# Examples:
#   ./skills.sh add skill-auditor --scope project --agent cursor
#   ./skills.sh add skill-auditor --from ./skills-dist
#   ./skills.sh remove skill-auditor --scope project
#
# From any repo (no clone):
#   curl -fsSL https://raw.githubusercontent.com/al4f/skills-house/main/skills.sh | bash -s -- add skill-auditor --scope project

set -euo pipefail

SKILLS_HOUSE_REPO="${SKILLS_HOUSE_REPO:-https://raw.githubusercontent.com/al4f/skills-house/main}"
SKILLS_SH_ROOT=""
if [[ -f "${BASH_SOURCE[0]}" ]]; then
  SKILLS_SH_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

usage() {
  sed -n '3,22p' "$0" | sed 's/^# \?//'
}

npm_package_for_skill() {
  printf '@skills-house/skill-%s' "$1"
}

resolve_install_dir() {
  if [[ -n "${SKILLS_INSTALL_DIR:-}" && -f "${SKILLS_INSTALL_DIR}/install-skills.sh" ]]; then
    printf '%s' "$SKILLS_INSTALL_DIR"
    return
  fi

  if [[ -n "$SKILLS_SH_ROOT" && -f "$SKILLS_SH_ROOT/internal-scripts/install/install-skills.sh" ]]; then
    printf '%s/internal-scripts/install' "$SKILLS_SH_ROOT"
    return
  fi

  local cache="${XDG_CACHE_HOME:-$HOME/.cache}/skills-house/install"
  mkdir -p "$cache/lib"
  curl -fsSL "$SKILLS_HOUSE_REPO/internal-scripts/install/install-skills.sh" \
    -o "$cache/install-skills.sh"
  curl -fsSL "$SKILLS_HOUSE_REPO/internal-scripts/install/remove-skills.sh" \
    -o "$cache/remove-skills.sh"
  curl -fsSL "$SKILLS_HOUSE_REPO/internal-scripts/install/lib/agent-targets.sh" \
    -o "$cache/lib/agent-targets.sh"
  chmod +x "$cache/install-skills.sh" "$cache/remove-skills.sh"
  printf '%s' "$cache"
}

fetch_skill_from_npm() {
  local skill="$1"
  local pkg work_dir tarball
  pkg="$(npm_package_for_skill "$skill")"
  work_dir="$(mktemp -d "${TMPDIR:-/tmp}/skills-house.XXXXXX")"

  if ! (cd "$work_dir" && npm pack "$pkg" >/dev/null 2>&1); then
    echo "Could not download $pkg from npm." >&2
    echo "Check the package exists: npm view $pkg version" >&2
    rm -rf "$work_dir"
    exit 1
  fi

  tarball="$(find "$work_dir" -maxdepth 1 -name '*.tgz' -print -quit)"
  tar -xzf "$tarball" -C "$work_dir"
  mkdir -p "$work_dir/dist/$skill"
  cp -R "$work_dir/package/." "$work_dir/dist/$skill/"
  rm -rf "$work_dir/package" "$tarball"
  printf '%s/dist' "$work_dir"
}

parse_add_args() {
  SKILL=""
  FROM=""
  INSTALL_ARGS=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --from)
        FROM="$2"
        shift 2
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        if [[ -z "$SKILL" ]]; then
          SKILL="$1"
          shift
        else
          INSTALL_ARGS+=("$1")
          shift
        fi
        ;;
    esac
  done
}

cmd_add() {
  parse_add_args "$@"
  [[ -n "$SKILL" ]] || { echo "Missing skill name." >&2; usage >&2; exit 1; }

  local install_dir dist_dir
  install_dir="$(resolve_install_dir)"

  if [[ -n "$FROM" ]]; then
    dist_dir="$(cd "$FROM" && pwd)"
  else
    dist_dir="$(fetch_skill_from_npm "$SKILL")"
  fi

  SKILLS_DIST_DIR="$dist_dir" SKILLS_REPO_ROOT="${SKILLS_REPO_ROOT:-$(pwd)}" \
    bash "$install_dir/install-skills.sh" --skill "$SKILL" "${INSTALL_ARGS[@]}"

  echo ""
  echo "Learn more: https://al4f.dev"
}

cmd_remove() {
  local skill="$1"
  shift
  [[ -n "$skill" ]] || { echo "Missing skill name." >&2; usage >&2; exit 1; }

  local install_dir
  install_dir="$(resolve_install_dir)"

  SKILLS_REPO_ROOT="${SKILLS_REPO_ROOT:-$(pwd)}" \
    bash "$install_dir/remove-skills.sh" --skill "$skill" "$@"
}

main() {
  case "${1:-}" in
    add)
      shift
      cmd_add "$@"
      ;;
    remove)
      shift
      [[ $# -ge 1 ]] || { echo "Missing skill name." >&2; usage >&2; exit 1; }
      cmd_remove "$@"
      ;;
    --help|-h|"")
      usage
      ;;
    *)
      echo "Unknown command: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"
