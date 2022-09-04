FROM node:16.17-alpine3.16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npm install --global @nestjs/cli@9.0.0 && yarn build

CMD node dist/main
