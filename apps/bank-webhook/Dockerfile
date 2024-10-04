FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps/bank-webhook/package.json ./apps/bank-webhook/
COPY packages ./packages

RUN npm install

RUN npm run generate:db

COPY apps/bank-webhook ./apps/bank-webhook

WORKDIR /app/apps/bank-webhook

RUN npm run build

EXPOSE 3002

CMD [ "npm", "run", "start" ]