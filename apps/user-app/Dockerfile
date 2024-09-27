FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps/user-app ./apps/user-app
COPY packages ./packages

RUN npm install

RUN npm run generate:db

WORKDIR /app/apps/user-app

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start" ]