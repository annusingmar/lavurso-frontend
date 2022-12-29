FROM node:16-alpine

WORKDIR /app

RUN npm install -g @quasar/cli

COPY package*.json ./

RUN npm install

COPY . .

RUN quasar build

WORKDIR /app/dist/spa

CMD ["quasar", "serve", "-p", "9000"]