#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "Starting PUBLIC mode preview at http://localhost:3000"
NEXT_PUBLIC_DEV_MODE=false npm run dev
