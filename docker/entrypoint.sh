#!/bin/bash
set -euo pipefail

export BACKEND_UPSTREAM="${BACKEND_UPSTREAM:-127.0.0.1:3000}"

# Render nginx config from template (gettext envsubst).
template="/etc/nginx/templates/default.conf.template"
if [[ -f "$template" ]]; then
  mkdir -p /etc/nginx/conf.d
  envsubst '${BACKEND_UPSTREAM}' < "$template" > /etc/nginx/conf.d/default.conf
fi

su-exec app:app /usr/local/bin/node /app/backend/src/server.js &
exec nginx -g 'daemon off;'
