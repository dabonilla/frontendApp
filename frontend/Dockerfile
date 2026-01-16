# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copiamos dependencias primero (mejor cache)
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copiamos el resto del proyecto
    COPY . .
    
    # Build de Vite
    RUN npm run build
    
    
    # ---------- Stage 2: Production ----------
    FROM nginx:alpine
    
    # Copiamos el build al servidor nginx
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Exponemos el puerto 80
    EXPOSE 80
    
    # Nginx corre por defecto
    CMD ["nginx", "-g", "daemon off;"]
    