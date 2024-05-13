FROM node:latest as builder
LABEL authors="Mateus Fernandes <mf@iungoweb.io>"

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

FROM builder as prod-builder

RUN npm run build

FROM nginx:latest as prod

COPY --from=prod-builder /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]