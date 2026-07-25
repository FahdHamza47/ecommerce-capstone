# ---- Stage 1: Build ----
FROM node:20-slim AS builder

WORKDIR /app

# Accept the build arg passed from docker-compose.yml
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Remove the default Nginx welcome page config
RUN rm -rf /usr/share/nginx/html/*

# Copy our built static files (from Vite's `dist/` output) into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config (handles React Router's client-side routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]