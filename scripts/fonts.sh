#!/bin/sh
set -e

source_dir=${KELSON_DIR:-fonts-private}
out_dir=src/fonts
fallback=

mkdir -p "$out_dir"

for pair in 300:light 400:normal 700:bold; do
  weight=${pair%%:*}
  name=${pair#*:}
  if [ -f "$source_dir/kelson-sans-$name.woff2" ]; then
    cp "$source_dir/kelson-sans-$name.woff2" "$out_dir/display-$weight.woff2"
  else
    cp "node_modules/@fontsource/oswald/files/oswald-latin-$weight-normal.woff2" "$out_dir/display-$weight.woff2"
    fallback=1
  fi
done

if [ -n "$fallback" ]; then
  echo "Kelson Sans not found in $source_dir, using Oswald" >&2
fi
