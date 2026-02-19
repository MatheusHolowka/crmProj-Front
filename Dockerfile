# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Ajustado para o nome real da pasta do seu projeto
COPY --from=build /app/dist/crm-proj-front/browser /usr/share/nginx/html
# Configuração para evitar erro 404 em SPAs
RUN printf 'server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]