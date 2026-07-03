#!/usr/bin/env bash
# Publish a built skill to skills.sh via a versioned git tag.
#
# skills.sh indexes public repos when users run `npx skills add`. This script
# creates an annotated tag at the current commit and (optionally) pushes it so
# consumers can install a pinned release from skills-dist/.
#
# Usage:
#   publish-skill.sh <skill-name> [version] [options]
#
# Options:
#   --push           Push the tag to origin after creating it
#   --bootstrap      Run a global install via npx skills (registers telemetry)
#   --no-build       Skip pnpm build for the skill
#   --allow-dirty    Allow uncommitted changes in skills-dist/
#   --dry-run        Print actions without creating tags or installing
#   --remote <name>  Git remote to push to (default: origin)
#   --help           Show this help
#
# Tag format: <skill>/v<semver>  (e.g. brainstorming/v1.0.0)
#
# Examples:
#   ./publish-skill.sh brainstorming
#   ./publish-skill.sh brainstorming 1.0.0 --push --bootstrap
#   ./publish-skill.sh brainstorming --dry-run

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
# shellcheck source=lib/github-repo.sh
source "$SCRIPT_DIR/lib/github-repo.sh"
# shellcheck source=lib/skill-tag.sh
source "$SCRIPT_DIR/lib/skill-tag.sh"

SKILL=""
VERSION_ARG=""
PUSH=false
BOOTSTRAP=false
NO_BUILD=false
ALLOW_DIRTY=false
DRY_RUN=false
REMOTE="origin"

usage() {
  sed -n '3,27p' "$0" | sed 's/^# \?//'
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
    --push) PUSH=true; shift ;;
    --bootstrap) BOOTSTRAP=true; shift ;;
    --no-build) NO_BUILD=true; shift ;;
    --allow-dirty) ALLOW_DIRTY=true; shift ;;
    --dry-run) DRY_RUN=true; shift ;;
    --remote)
      [[ $# -ge 2 ]] || { echo "Missing value for --remote" >&2; exit 1; }
      REMOTE="$2"
      shift 2
      ;;
    --help|-h) usage; exit 0 ;;
    --*) echo "Unknown option: $1" >&2; usage >&2; exit 1 ;;
    *)
      if [[ -z "$SKILL" ]]; then
        SKILL="$1"
      elif [[ -z "$VERSION_ARG" ]]; then
        VERSION_ARG="$1"
      else
        echo "Unexpected argument: $1" >&2
        usage >&2
        exit 1
      fi
      shift
      ;;
  esac
done

if [[ -z "$SKILL" ]]; then
  echo "Missing skill name." >&2
  usage >&2
  exit 1
fi

SKILL_SRC="$REPO_ROOT/skills/$SKILL"
SKILL_DIST="$REPO_ROOT/$DIST_SUBPATH/$SKILL"

if [[ ! -d "$SKILL_SRC" || ! -f "$SKILL_SRC/SKILL.md" ]]; then
  echo "Skill source not found: $SKILL_SRC" >&2
  exit 1
fi

if [[ "$NO_BUILD" != true ]]; then
  log "Building @skills-house/$SKILL ..."
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] pnpm --filter @skills-house/$SKILL build"
  else
    (cd "$REPO_ROOT" && pnpm --filter "@skills-house/$SKILL" build)
  fi
fi

if [[ ! -f "$SKILL_DIST/SKILL.md" ]]; then
  echo "Built skill not found at $SKILL_DIST — run pnpm build first." >&2
  exit 1
fi

if [[ "$ALLOW_DIRTY" != true ]]; then
  if ! git -C "$REPO_ROOT" diff --quiet -- "$DIST_SUBPATH/$SKILL"; then
    echo "skills-dist/$SKILL has uncommitted changes." >&2
    echo "Commit the built output, then re-run publish (or pass --allow-dirty)." >&2
    exit 1
  fi
  if ! git -C "$REPO_ROOT" diff --cached --quiet -- "$DIST_SUBPATH/$SKILL"; then
    echo "skills-dist/$SKILL has staged but uncommitted changes." >&2
    echo "Commit the built output, then re-run publish (or pass --allow-dirty)." >&2
    exit 1
  fi
fi

if [[ -n "$VERSION_ARG" ]]; then
  VERSION="$(normalize_version "$VERSION_ARG")" || exit 1
else
  VERSION="$(read_skill_version "$SKILL_SRC")" || exit 1
fi

TAG="$(skill_tag_name "$SKILL" "$VERSION")"
GITHUB_REPO="$(resolve_github_repo "$REMOTE")" || exit 1

if git -C "$REPO_ROOT" rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag already exists: $TAG" >&2
  exit 1
fi

COMMIT="$(git -C "$REPO_ROOT" rev-parse HEAD)"
INSTALL_SOURCE="$(skills_sh_install_source "$GITHUB_REPO" "$SKILL" "$TAG")"
INSTALL_LATEST="$(skills_sh_install_source_latest "$GITHUB_REPO" "$SKILL")"
TREE_URL="$(skills_sh_tree_url "$GITHUB_REPO" "$SKILL" "$TAG")"

log ""
log "Publish $SKILL @ $VERSION"
log "  Tag:     $TAG"
log "  Commit:  $COMMIT"
log "  Remote:  $REMOTE ($GITHUB_REPO)"
log ""
log "Install (pinned to this release):"
log "  npx skills add $INSTALL_SOURCE -g -y"
log ""
log "Install (latest on default branch):"
log "  npx skills add $INSTALL_LATEST -g -y"
log ""
log "GitHub tree URL:"
log "  $TREE_URL"
log ""

MESSAGE="Release $SKILL $VERSION"
log "Creating annotated tag ..."
run git -C "$REPO_ROOT" tag -a "$TAG" -m "$MESSAGE"

if [[ "$PUSH" == true ]]; then
  log "Pushing tag to $REMOTE ..."
  run git -C "$REPO_ROOT" push "$REMOTE" "$TAG"
fi

if [[ "$BOOTSTRAP" == true ]]; then
  log "Bootstrapping skills.sh telemetry (global install) ..."
  if [[ "$DRY_RUN" == true ]]; then
    log "[dry-run] npx skills add $INSTALL_SOURCE -g -y"
  else
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    if [[ -s "$NVM_DIR/nvm.sh" ]]; then
      # shellcheck source=/dev/null
      . "$NVM_DIR/nvm.sh"
      (cd "$REPO_ROOT" && nvm use >/dev/null)
    fi
    npx --yes skills@latest add "$INSTALL_SOURCE" -g -y
  fi
fi

log ""
if [[ "$PUSH" == true ]]; then
  log "Published. Tag $TAG is on $REMOTE."
else
  log "Tag created locally. Push with:"
  log "  git push $REMOTE $TAG"
fi
