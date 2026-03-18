#!/usr/bin/env bash
# Usage: ./scripts/push-to-github.sh https://github.com/YOURNAME/family-memories.git
# Create an EMPTY repo on GitHub first (no README), then run this.
set -e
URL="${1:?Usage: $0 https://github.com/YOU/family-memories.git}"
cd "$(dirname "$0")/.."
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$URL"
else
  git remote add origin "$URL"
fi
git push -u origin main
echo "Done. Next: import this repo in Vercel and add env vars (see YOUR_NEXT_STEPS.md)."
