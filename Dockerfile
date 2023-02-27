FROM node:16-alpine

WORKDIR /app

RUN npm install -g @quasar/cli

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["quasar", "serve", "-p", "9000"]