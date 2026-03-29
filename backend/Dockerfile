FROM node:20-alpine AS deps
WORKDIR /app

# Prisma generate in postinstall needs schema + config and placeholder URLs.
ENV DIRECT_URL=postgresql://postgres:postgres@localhost:5432/postgres
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3001
CMD ["npm", "run", "start"]
