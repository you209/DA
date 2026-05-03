#!/bin/bash
set -e

# Temporarily exclude server-only API routes from the static export build.
# These routes run on a separate backend; they are not bundled into the APK.
API_DIR="app/api"
API_BACKUP="/tmp/helphub-api-backup"

cleanup() {
  if [ -d "$API_BACKUP" ]; then
    mv "$API_BACKUP" "$API_DIR"
  fi
}
trap cleanup EXIT

mv "$API_DIR" "$API_BACKUP"
npm run build
