FROM node:22-alpine

WORKDIR /app

COPY yarn.lock .yarnrc.yml package.json ./

RUN corepack enable && yarn set version 4.5.2 && yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]