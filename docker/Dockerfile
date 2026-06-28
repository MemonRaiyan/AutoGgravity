# Base setup
FROM node:18-alpine AS base
WORKDIR /usr/src/app
# npm workspaces require all package.json files to install properly
COPY package.json turbo.json ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN npm install

# Build stage
FROM base AS builder
COPY . .
RUN npx turbo run build

# API Production
FROM node:18-alpine AS api
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/
COPY --from=builder /usr/src/app/packages/config/dist ./packages/config/dist
COPY --from=builder /usr/src/app/packages/types/dist ./packages/types/dist
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist
# Prisma engine
COPY --from=builder /usr/src/app/database ./database
WORKDIR /usr/src/app/apps/api
EXPOSE 4000
CMD ["npm", "start"]

# Dashboard Production
FROM node:18-alpine AS dashboard
WORKDIR /usr/src/app/apps/dashboard
COPY --from=builder /usr/src/app/apps/dashboard/public ./public
COPY --from=builder /usr/src/app/apps/dashboard/.next/standalone ./
COPY --from=builder /usr/src/app/apps/dashboard/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
