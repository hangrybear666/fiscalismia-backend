# Stage 1 BUILD
FROM node:20.12.2-alpine3.19 AS build
WORKDIR /build-dir/
COPY package-lock.json package.json tsconfig.json ./
RUN npm install
COPY src/ ./src
RUN npm run build

# Stage 2 RUN IN PRODUCTION
FROM node:20.12.2-alpine3.19
WORKDIR /fiscalismia-backend/
COPY package-lock.json package.json ./
RUN npm install --omit=dev
COPY --from=build build-dir/build ./build
COPY LICENSE README.md ./
# set NODE_ENV command from the start script is unique to windows so for linux NODE_ENV has to be set here
ENV NODE_ENV=production
ENTRYPOINT ["npm", "run", "start"]

# docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
# docker run --network fiscalismia-network -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
