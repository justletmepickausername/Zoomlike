FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:1.25.4-alpine3.18

COPY --from=build /app/dist/zoomlike/ /usr/share/nginx/html

EXPOSE 80