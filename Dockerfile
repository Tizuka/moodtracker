FROM node:20-alpine
WORKDIR /usr/src/app
# Definir o diretório de trabalho onde os comandos subsequentes serão executados.
# Em termos simples: ele funciona como o comando cd (change directory) do terminal, mas dentro do processo de construção da imagem do Docker.
COPY package*.json ./
RUN npm ci --omit=dev
# Uses the package-lock.json file directly to install exact versions of 
# packages, ensuring deterministic builds across environments.  Deletes any 
# existing node_modules folder before installing.  
COPY --chown=node:node . .
# ex: COPY . .
# SEM --chown: os arquivos pertencerão ao 'root'!
# O processo Node.js rodando como 'node' pode falhar ao tentar ler/escrever arquivos.
USER node
EXPOSE 4000
CMD ["node", "app.js"]
