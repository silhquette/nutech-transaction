# Base stage
FROM node:23.11.1-slim AS base
# Tidak perlu setup PNPM atau Corepack jika pakai npm
WORKDIR /app

# Production dependencies stage
FROM base AS prod-deps
COPY package.json package-lock.json ./
# Install only production dependencies using npm
RUN npm install --omit=dev --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache
# Cleanup cache
RUN rm -rf /tmp/npmcache

# Build stage - install all dependencies and build
FROM base AS build
COPY package.json package-lock.json ./
# Install all dependencies using npm
RUN npm install --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache
COPY . .
RUN npm run build
# Cleanup cache
RUN rm -rf /tmp/npmcache

# Final stage - combine production dependencies and build output
FROM node:23.11.1-alpine AS runner
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Use the node user from the image
USER node

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
