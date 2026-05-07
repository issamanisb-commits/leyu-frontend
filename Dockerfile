# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy environment files and package files

COPY package*.json ./
RUN pnpm install



# Copy the rest of the app and build
COPY . .
RUN pnpm run build

#ENV NODE_ENV production
# Copy environment files and necessary files from builder stage


EXPOSE 3000

CMD ["pnpm", "start"]