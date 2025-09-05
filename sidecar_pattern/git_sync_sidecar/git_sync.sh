#!/bin/sh

set -eu

REPO_DIR="${REPO_DIR:-/repo}"
SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-10}"

mkdir -p "$REPO_DIR"
cd "$REPO_DIR"

# Configure HTTPS auth via GitHub token if provided
if [ -n "${GITHUB_TOKEN:-}" ]; then
  # Route any https://github.com/ URL through a token-authenticated URL
  git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/" || true
fi

if [ ! -d .git ]; then
  if [ -n "${GIT_REMOTE_URL:-}" ]; then
    # If directory is empty, clone directly into it; otherwise, init and attach remote
    if [ -z "$(ls -A "$REPO_DIR" 2>/dev/null)" ]; then
      git clone --branch "${GIT_BRANCH:-main}" "$GIT_REMOTE_URL" .
    else
      git init
      git remote add origin "$GIT_REMOTE_URL" 2>/dev/null || git remote set-url origin "$GIT_REMOTE_URL"
      git fetch origin "${GIT_BRANCH:-main}" || true
      git checkout -B "${GIT_BRANCH:-main}" --track "origin/${GIT_BRANCH:-main}" 2>/dev/null || git checkout -B "${GIT_BRANCH:-main}"
      git reset --hard "origin/${GIT_BRANCH:-main}" || true
    fi
  else
    git init
  fi
fi

git config --global --add safe.directory "$REPO_DIR" || true

echo "Starting git sync loop in $REPO_DIR"
while true; do
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git pull --rebase || true
  fi
  sleep "$SYNC_INTERVAL_SECONDS"
done