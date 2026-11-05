#!/usr/bin/env bash
set -euo pipefail

# Capacitor needs static HTML in out/, but server deployments keep Next.js.
cd "$(dirname "$0")/.."

# Remove server-only API routes just for the export and restore on any exit.
BACKUP_DIR="$(mktemp -d)"
restore() {
  if [[ -d "$BACKUP_DIR/api" ]]; then
    mv "$BACKUP_DIR/api" app/api
  fi
  rm -rf "$BACKUP_DIR"
}
trap restore EXIT

if [[ -d app/api ]]; then
  mv app/api "$BACKUP_DIR/api"
fi

rm -rf out
CAPACITOR_BUILD=1 npm run build

if [[ ! -f out/index.html ]]; then
  echo "Static export failed: out/index.html was not generated" >&2
  exit 1
fi
