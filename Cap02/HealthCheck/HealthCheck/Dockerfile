# Use uma imagem do Node como base para construir a aplicação
FROM node:18 AS build

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos `package.json` e `package-lock.json` para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código-fonte do Angular para o contêiner
COPY . .

# Execute o build da aplicação Angular
RUN npm run build --prod

# Use uma imagem de servidor NGINX para hospedar a aplicação
FROM nginx:alpine

# Copie os arquivos da aplicação Angular para o diretório padrão do NGINX
COPY --from=build /app/dist/HealthCheck /usr/share/nginx/html

# Copie o arquivo de configuração do NGINX para o contêiner
COPY nginx.conf /etc/nginx/nginx.conf

# Copie os certificados SSL para o contêiner
COPY ssl /etc/nginx/ssl

# Exponha a porta 80 para o NGINX
EXPOSE 80 
EXPOSE 443

# Comando padrão para iniciar o NGINX
CMD ["nginx", "-g", "daemon off;"]
