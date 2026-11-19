# ---------- Stage 1: Build (Vite + React) ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install deps dulu (layer cache-friendly)
COPY package.json package-lock.json ./
RUN npm ci

# Salin sumber + config (folder .figma dibutuhkan vite.config.ts)
COPY . .

# Build menghasilkan folder dist/
RUN npm run build

# ---------- Stage 2: Runtime (nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Konfigurasi SPA (fallback ke index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Aset statis hasil build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
