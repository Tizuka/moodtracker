FROM node:20-alpine

# Define a pasta de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependência PRIMEIRO
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --omit=dev

# Copia TODOS os arquivos do projeto para o container
COPY --chown=node:node . .

# Muda para o usuário sem privilégios por segurança
USER node

# Porta que a aplicação escuta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["node", "app.js"]