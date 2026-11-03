#!/usr/bin/env bash
# SociallyDead Friday directory bot. GPL-2.0-only. See LICENSE.
# Reads the X feed and pushes listings that match.
# The Grok bots desk lists this program. Cron runs it on Friday.
# A slow week holds the pass so FauxNews can file. A held pass does not call the model.
set -euo pipefail

root="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$root"

node_bin=""
if [[ -d "${HOME}/.nvm/versions/node" ]]; then
  newest="$(find "${HOME}/.nvm/versions/node" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -V | tail -1)"
  if [[ -n "$newest" && -x "${HOME}/.nvm/versions/node/${newest}/bin/node" ]]; then
    node_bin="${HOME}/.nvm/versions/node/${newest}/bin"
  fi
fi
export PATH="${node_bin:+$node_bin:}/home/andreas/.grok/bin:/home/andreas/.local/bin:/usr/local/bin:/usr/bin:/bin"

logdir="${HOME}/.local/share/sociallydead"
mkdir -p "$logdir"
log="${logdir}/directory-bot.log"
lock="${logdir}/directory-bot.lock"
exec 9>"$lock"
if ! flock -n 9; then
  printf '%s skip: already running\n' "$(date -Is)" >> "$log"
  exit 0
fi

today="$(date +%F)"
since="$(date -d '7 days ago' +%F)"
prompt="$(sed -e "s/__SINCE__/${since}/g" -e "s/__TODAY__/${today}/g" "${root}/tools/directory-bot.prompt.md")"

if [[ "${1:-}" == "--print" ]]; then
  printf '%s\n' "$prompt"
  exit 0
fi

# Heavy pass. It waits when the week is being saved, so FauxNews can file.
status_dir="${DESK_STATUS_DIR:-${HOME}/.local/state/thewhitewitch/desk/status}"
write_status() {
  mkdir -p "$status_dir"
  local tmp="${status_dir}/sociallydead.txt.tmp"
  printf '%s\n' "$1" > "$tmp"
  mv "$tmp" "${status_dir}/sociallydead.txt"
}
reason="$(python3 -c 'import sys; sys.path.insert(0, "/home/andreas/Projects/bots"); import credits; print(credits.allow("heavy", "directory"), end="")')" || reason="Credits did not answer. Model jobs are held."
if [[ -n "$reason" ]]; then
  printf '%s held: %s\n' "$(date -Is)" "$reason" >> "$log"
  write_status "Held so FauxNews can file. ${reason}"
  exit 0
fi

{
  printf '===== %s since=%s =====\n' "$(date -Is)" "$since"
  set +e
  /home/andreas/.grok/bin/grok \
    --cwd "$root" \
    --no-auto-update \
    --yolo \
    --max-turns 60 \
    --output-format plain \
    --deny 'Bash(git push --force*)' \
    --deny 'Bash(git push -f*)' \
    --deny 'Bash(git reset --hard*)' \
    --deny 'Bash(rm -rf *)' \
    -p "$prompt"
  code=$?
  set -e
  printf '===== exit %s =====\n' "$code"
} >> "$log" 2>&1
exit "$code"
