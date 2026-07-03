# Tag naming and install-source helpers for skills.sh publishing.
# Source from publish-skill.sh.

DIST_SUBPATH="skills-dist"

normalize_version() {
  local version="$1"
  version="${version#v}"
  if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]]; then
    echo "Invalid semver: '$version' (expected MAJOR.MINOR.PATCH)" >&2
    return 1
  fi
  printf 'v%s' "$version"
}

skill_tag_name() {
  local skill="$1"
  local version="$2"
  printf '%s/%s' "$skill" "$version"
}

read_skill_version() {
  local skill_dir="$1"
  local pkg="$skill_dir/package.json"
  local version

  if [[ ! -f "$pkg" ]]; then
    echo "Missing package.json in $skill_dir" >&2
    return 1
  fi

  version="$(node -e "const p=require(process.argv[1]); if(!p.version){process.exit(2)}; process.stdout.write(String(p.version))" "$pkg" 2>/dev/null)" || {
    echo "Add a semver \"version\" field to $pkg before publishing." >&2
    return 1
  }

  normalize_version "$version"
}

skills_sh_install_source() {
  local github_repo="$1"
  local skill="$2"
  local tag="$3"
  printf '%s/%s/%s#%s' "$github_repo" "$DIST_SUBPATH" "$skill" "$tag"
}

skills_sh_install_source_latest() {
  local github_repo="$1"
  local skill="$2"
  printf '%s/%s --skill %s' "$github_repo" "$DIST_SUBPATH" "$skill"
}

skills_sh_tree_url() {
  local github_repo="$1"
  local skill="$2"
  local tag="$3"
  local owner repo
  owner="${github_repo%%/*}"
  repo="${github_repo#*/}"
  printf 'https://github.com/%s/%s/tree/%s/%s/%s' "$owner" "$repo" "$tag" "$DIST_SUBPATH" "$skill"
}
