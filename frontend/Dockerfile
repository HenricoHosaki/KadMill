# Etapa 1: Build da aplicação React
FROM node:24-alpine as build

WORKDIR /app

ARG VITE_API_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN VITE_API_URL=$VITE_API_URL npm run build

# Etapa 2: Servidor Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos gerados no build para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx (criaremos abaixo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]