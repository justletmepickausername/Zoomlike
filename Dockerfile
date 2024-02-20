FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN npm install --package-lock-only

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/zoomlike/ /usr/share/nginx/html

EXPOSE 80