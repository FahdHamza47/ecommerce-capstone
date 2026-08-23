FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Create the uploads folder so Multer has somewhere to write at runtime,
# and hand ownership to the non-root 'node' user (built into the official
# Node image). This matters because docker-compose mounts a named volume
# at this exact path — Docker copies a directory's ownership from the
# image into a named volume the first time it's created, so setting this
# now is what lets Multer (running as 'node' below) write into the
# volume-backed uploads directory at runtime.
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]