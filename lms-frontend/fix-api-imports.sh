#!/bin/bash

for file in $(grep -rl 'API_BASE_URL' src/); do
  # Salta si ya está el import
  grep -q 'import { API_BASE_URL' "$file" && continue

  # Calcular la ruta relativa del import
  DIR_DEPTH=$(echo "$file" | grep -o "/" | wc -l)
  RELATIVE_PATH=""
  for ((i=1; i<DIR_DEPTH; i++)); do
    RELATIVE_PATH+="../"
  done
  RELATIVE_PATH+="config"

  echo "🛠️ Corrigiendo: $file"

  # Insertar el import al inicio (después de cualquier comentario de licencia o import react)
  awk -v import="import { API_BASE_URL } from '$RELATIVE_PATH';" '
    NR == 1 && $0 ~ /^import/ { print import; print; next }
    NR == 1 && $0 ~ /^\/\// { print; next }
    NR == 2 && $0 ~ /^import/ { print import; print; next }
    NR == 1 { print import; print; next }
    { print }
  ' "$file" > tmp.jsx && mv tmp.jsx "$file"
done

echo "✅ Imports de API_BASE_URL corregidos."
