FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN echo npm --verison

RUN npm install -g npm@9.8.1

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/zoomlike/ /usr/share/nginx/html

EXPOSE 80