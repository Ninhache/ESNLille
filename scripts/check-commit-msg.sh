#!/bin/sh

message=$(sed -e '/^# -* >8 -*$/,$d' -e '/^#/d' "$1")
header=$(printf '%s\n' "$message" | sed -n '1p')
body=$(printf '%s\n' "$message" | sed -e '1d' -e '/^[[:space:]]*$/d')

case "$header" in
  "Merge "* | "Revert \""*) exit 0 ;;
esac

pattern='^(feat|fix|refactor|perf|test|docs|style|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: [a-z0-9](.{0,70}[^. ])?$'

if ! printf '%s\n' "$header" | grep -qE "$pattern"; then
  echo "Invalid title: $header" >&2
  echo "Expected: type(scope): subject, see CONTRIBUTING.md" >&2
  exit 1
fi

if [ -n "$body" ] && ! printf '%s\n' "$body" | grep -q '^BREAKING CHANGE: '; then
  echo "Title only: a body is allowed only for a BREAKING CHANGE footer" >&2
  exit 1
fi
