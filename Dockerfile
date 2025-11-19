# Base stage
FROM node:23.11.1-slim AS base
WORKDIR /app

# Production dependencies stage
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache
RUN rm -rf /tmp/npmcache

# Build stage - install all dependencies, generate prisma client, and build
FROM base AS build

# Declare build argument for DATABASE_URL
ARG DATABASE_URL

# Set it as environment variable for this stage
ENV DATABASE_URL=$DATABASE_URL

COPY package.json package-lock.json ./
RUN npm install --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache

COPY . .

# Generate Prisma Client (now DATABASE_URL is available)
RUN npx prisma generate

# Build the application
RUN npm run build
RUN rm -rf /tmp/npmcache

# Final stage
FROM node:23.11.1-alpine AS runner
WORKDIR /app

# Declare runtime DATABASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy dependencies and built files
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /app/prisma ./prisma

# Use the node user from the image
USER node

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]