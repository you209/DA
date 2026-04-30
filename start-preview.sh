#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/demo"
echo "Open http://localhost:4173 in your browser"
python3 -m http.server 4173
