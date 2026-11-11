# Alma Mineral · storefront Next.js 15 (standalone) para Coolify + WebProAI CMS
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY vendor/ ./vendor/
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_CMS_URL=https://webproai.tech
ARG NEXT_PUBLIC_CMS_SLUG=almamineral
ARG NEXT_PUBLIC_SITE_URL=https://tualmamineral.com
ARG NEXT_PUBLIC_PORTAL_ORIGINS=https://webproai.tech
ENV NEXT_PUBLIC_CMS_URL=$NEXT_PUBLIC_CMS_URL \
    NEXT_PUBLIC_CMS_SLUG=$NEXT_PUBLIC_CMS_SLUG \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_PORTAL_ORIGINS=$NEXT_PUBLIC_PORTAL_ORIGINS
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
