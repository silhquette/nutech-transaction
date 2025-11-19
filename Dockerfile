# Base stage
FROM node:23.11.1-slim AS base
WORKDIR /app

# Build stage - install all dependencies, generate prisma client, and build
FROM base AS build

# Declare build argument for DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm install --no-frozen-lockfile

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production dependencies stage
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-frozen-lockfile

# Final runtime stage
FROM node:23.11.1-alpine AS runner
WORKDIR /app

# Runtime DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

# Copy production node_modules
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=node:node /app/dist ./dist

# Copy generated Prisma Client from build stage
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma

# Copy package.json for any runtime needs
COPY --from=build --chown=node:node /app/package.json ./package.json

# IMPORTANT: Copy prisma schema for potential runtime migrations
COPY --chown=node:node prisma ./prisma

USER node
EXPOSE 8080

CMD ["node", "dist/index.js"]