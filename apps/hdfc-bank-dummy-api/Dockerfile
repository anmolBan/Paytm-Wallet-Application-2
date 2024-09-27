FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps/hdfc-bank-dummy-api ./apps/hdfc-bank-dummy-api
COPY packages ./packages

RUN npm install

RUN npm run generate:db

WORKDIR /app/apps/hdfc-bank-dummy-api

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "start" ]