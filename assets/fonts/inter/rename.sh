#!/usr/bin/env bash

declare -A weights=(
  [Thin]=100
  [ExtraLight]=200
  [Light]=300
  [Regular]=400
  [Medium]=500
  [SemiBold]=600
  [Bold]=700
  [ExtraBold]=800
  [Black]=900
)

for name in "${!weights[@]}"; do
  weight="${weights[$name]}"

  input="Inter_18pt-${name}.ttf"

  if [[ -f "$input" ]]; then
    pyftsubset "$input" \
      --output-file="${weight}.woff2" \
      --flavor=woff2 \
      --unicodes='*'

    echo "$input -> ${weight}.woff2"
  fi
done
