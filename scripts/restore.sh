#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL}"
file="${1:?Usage: ./scripts/restore.sh <backup.sql>}"
psql "$DATABASE_URL" < "$file"
echo "Restore completed from $file"
