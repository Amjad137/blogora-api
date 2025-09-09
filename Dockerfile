# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Builder stage
FROM base AS builder

# Install build dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Set environment variables for build
ENV HUSKY=0
ENV NODE_ENV=production

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install all dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Skip environment file copying 

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy package files
COPY --from=builder --chown=nestjs:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nestjs:nodejs /app/yarn.lock /app/yarn.lock

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist /app/dist

# Set production environment
ENV NODE_ENV=production
ENV APP_HOST=0.0.0.0
ENV APP_PORT=8080

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "/app/dist/main.js"]
