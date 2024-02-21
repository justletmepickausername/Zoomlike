FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN rm -rf node_modules

RUN npm cache clear

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/zoomlike/ /usr/share/nginx/html

EXPOSE 80