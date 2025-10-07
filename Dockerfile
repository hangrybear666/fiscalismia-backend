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
# COPY DB INIT SCRIPTS FOR ON-DEMAND USER SCHEMA CREATION
COPY database/pgsql-ddl.sql ./database/pgsql-ddl.sql
COPY database/pgsql-dml.sql ./database/pgsql-dml.sql
COPY LICENSE README.md ./
ENTRYPOINT ["npm", "run", "prod"]