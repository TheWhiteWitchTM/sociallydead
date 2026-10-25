#!/usr/bin/env bash
# SociallyDead directory editor. GPL-2.0-only. See LICENSE.
set -euo pipefail
cd "$(dirname "$0")/.."
exec node tools/edit-directory.mjs "$@"
