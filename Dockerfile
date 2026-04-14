# --- Stage 1: React (Vite) frontend ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY note-taker/package*.json ./
RUN npm ci
COPY note-taker/ ./
RUN npm run build

# --- Stage 2: Express backend ---
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY backend/src ./backend/src

# --- Stage 3: Nginx + Node backend (non-root backend process) ---
FROM nginx:stable-alpine
RUN apk add --no-cache bash su-exec gettext
COPY --from=node:20-alpine /usr/local/bin/node /usr/local/bin/node

COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY --from=backend-build /app/node_modules /app/backend/node_modules
COPY --from=backend-build /app/backend/src /app/backend/src

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && addgroup -g 1000 app \
    && adduser -D -u 1000 -G app app \
    && chown -R app:app /app/backend

ENV BACKEND_UPSTREAM=127.0.0.1:3000 \
    PORT=3000

EXPOSE 80 3000

ENTRYPOINT ["/entrypoint.sh"]
