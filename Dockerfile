FROM node:22-alpine

WORKDIR /app

COPY yarn.lock package.json ./

RUN corepack enable && yarn set version 4.5.2

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]