#!/usr/bin/env bash
# Sync the publishable files from the repo root into dist/, which is what the
# Cloudflare Worker actually serves.
#
#   ./build.sh          sync source -> dist
#   ./build.sh --check  fail if they differ, change nothing
#
# Why this exists: every page lived twice, by hand, with nothing enforcing that
# the two copies matched. The analytics beacon was once deployed to production
# from the working tree and never committed, so for a while git did not describe
# what the site was serving. Run --check before deploying, and the mirror cannot
# rot silently.
#
# dist/ stays committed on purpose: `wrangler deploy` uploads it directly, so a
# clone must be able to deploy without running a build first.

set -euo pipefail
cd "$(dirname "$0")"

# Everything the site serves. Anything not listed here (PRODUCT.md, DESIGN.md,
# ads/, .claude/) is repo furniture and must not reach the public bucket.
FILES=(
  index.html
  homelab.html
  privacy.html
  setup.html
  terms.html
  buy.html
  order/thanks.html
  styles.css
  waitlist.js
  buy.js
  robots.txt
  sitemap.xml
)
DIRS=(assets billing)

CHECK=false
[[ "${1:-}" == "--check" ]] && CHECK=true

fail=0
note() { printf '  %s\n' "$1"; }

for f in "${FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "missing source file: $f" >&2; exit 1
  fi
  if [[ "$CHECK" == true ]]; then
    if [[ ! -f "dist/$f" ]]; then
      note "MISSING in dist: $f"; fail=1
    elif ! cmp -s "$f" "dist/$f"; then
      note "DIFFERS: $f"; fail=1
    fi
  else
    mkdir -p "dist/$(dirname "$f")"
    cp -p "$f" "dist/$f"
  fi
done

for d in "${DIRS[@]}"; do
  [[ -d "$d" ]] || continue
  if [[ "$CHECK" == true ]]; then
    if ! diff -rq "$d" "dist/$d" >/dev/null 2>&1; then
      note "DIFFERS: $d/"
      diff -rq "$d" "dist/$d" 2>&1 | sed 's/^/    /' | head -5
      fail=1
    fi
  else
    mkdir -p "dist/$d"
    rsync -a --delete "$d/" "dist/$d/" 2>/dev/null || { rm -rf "dist/$d"; cp -R "$d" "dist/$d"; }
  fi
done

# Nothing should be in dist/ that no longer exists in source.
while IFS= read -r p; do
  rel="${p#dist/}"
  top="${rel%%/*}"
  if [[ ! -e "$rel" ]] && [[ ! " ${DIRS[*]} " == *" $top "* ]]; then
    if [[ "$CHECK" == true ]]; then note "ORPHAN in dist (no source): $rel"; fail=1
    else note "removing orphan: $rel"; rm -f "$p"; fi
  fi
done < <(find dist -type f -not -path 'dist/assets/*' -not -path 'dist/billing/*')

if [[ "$CHECK" == true ]]; then
  if [[ "$fail" -eq 1 ]]; then
    echo "dist/ is out of sync with source. Run ./build.sh and commit the result." >&2
    exit 1
  fi
  echo "dist/ matches source."
else
  echo "dist/ synced from source."
fi
