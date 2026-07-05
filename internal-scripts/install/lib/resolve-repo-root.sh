# Resolve the skills project / monorepo root for install scripts.
# Source from install-skills.sh and remove-skills.sh.

resolve_repo_root() {
  local script_dir="$1"
  local start_dir=""

  if [[ -n "${SKILLS_REPO_ROOT:-}" ]]; then
    (cd "$SKILLS_REPO_ROOT" && pwd)
    return
  fi

  if [[ -n "${INIT_CWD:-}" ]]; then
    start_dir="$INIT_CWD"
  else
    start_dir="$script_dir"
  fi

  local dir
  dir="$(cd "$start_dir" && pwd)"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/pnpm-workspace.yaml" ]]; then
      printf '%s\n' "$dir"
      return
    fi
    if [[ -f "$dir/package.json" && ( -d "$dir/skills-dist" || -d "$dir/skills" ) ]]; then
      printf '%s\n' "$dir"
      return
    fi
    dir="$(dirname "$dir")"
  done

  case "$script_dir" in
    */internal-scripts/install)
      (cd "$script_dir/../.." && pwd)
      ;;
    */node_modules/@skills-house/install|*/node_modules/@skills-house/install/*)
      (cd "$script_dir/../../.." && pwd)
      ;;
    *)
      (cd "$script_dir/../.." && pwd)
      ;;
  esac
}
