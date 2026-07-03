# Resolve GitHub owner/repo from git remotes.
# Source from publish-skill.sh.

resolve_github_repo() {
  local remote="${1:-origin}"
  local url owner repo

  url="$(git remote get-url "$remote" 2>/dev/null)" || {
    echo "Could not read git remote '$remote'." >&2
    return 1
  }

  case "$url" in
    git@github.com:*)
      url="${url#git@github.com:}"
      url="${url%.git}"
      owner="${url%%/*}"
      repo="${url#*/}"
      ;;
    https://github.com/*|http://github.com/*|https://*@github.com/*|http://*@github.com/*)
      url="${url#https://}"
      url="${url#http://}"
      url="${url#*@}"
      url="${url#github.com/}"
      url="${url%.git}"
      owner="${url%%/*}"
      repo="${url#*/}"
      ;;
    *)
      echo "Remote '$remote' is not a GitHub URL: $url" >&2
      return 1
      ;;
  esac

  if [[ -z "$owner" || -z "$repo" || "$owner" == "$repo" ]]; then
    echo "Could not parse owner/repo from remote '$remote'." >&2
    return 1
  fi

  printf '%s/%s' "$owner" "$repo"
}
