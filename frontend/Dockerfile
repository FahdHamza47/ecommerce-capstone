FROM node:20-slim AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_ASSET_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ASSET_URL=$VITE_ASSET_URL

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]