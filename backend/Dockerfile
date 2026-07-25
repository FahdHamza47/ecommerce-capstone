# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first — Docker caches this layer separately,
# so `npm install` only reruns when dependencies actually change, not on every code edit
COPY package*.json ./
RUN npm install

# Copy the rest of the source and compile TypeScript -> JavaScript
COPY . .
RUN npm run build

# ---- Stage 2: Production Runtime ----
FROM node:20-alpine

WORKDIR /app

# Only copy package files + install PRODUCTION dependencies (no devDependencies like ts-node-dev, jest, etc.)
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the compiled output from the builder stage — not the raw TypeScript source
COPY --from=builder /app/dist ./dist

# Create the uploads folder so Multer has somewhere to write at runtime
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "dist/server.js"]