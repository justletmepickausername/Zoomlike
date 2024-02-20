FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN npm install --package-lock-only

FROM nginx:alpine

COPY --from=build /app/dist/zoomlike/ /usr/share/nginx/html

EXPOSE 80