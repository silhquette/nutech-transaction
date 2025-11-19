# Base stage
FROM node:23.11.1-slim AS base
WORKDIR /app

# Production dependencies stage (unchanged as no prisma generate is needed here)
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache
RUN rm -rf /tmp/npmcache

# Build stage - install all dependencies, generate prisma client, and build
FROM base AS build
COPY package.json package-lock.json ./
RUN npm install --no-frozen-lockfile --ignore-scripts --cache /tmp/npmcache
COPY . .

# Add this line to generate the Prisma client before building the TypeScript code
RUN npx prisma generate

RUN npm run build
RUN rm -rf /tmp/npmcache

# Final stage (unchanged)
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
