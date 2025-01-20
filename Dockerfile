FROM node:18 AS build-client
WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ ./
RUN npm run build --prod

FROM node:18
WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server/ ./

COPY --from=build-client /app/client/dist/client /app/server/public

EXPOSE 3000

CMD ["node", "app.js"]

