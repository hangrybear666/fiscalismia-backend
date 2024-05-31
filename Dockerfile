#
FROM node:20.12.2-alpine3.19
WORKDIR /fiscalismia-backend/
COPY src/ ./src
COPY LICENSE package-lock.json package.json tsconfig.json ./
RUN npm install
ENTRYPOINT ["npm", "run", "server"]
# tests folder later for workflow
# public mounten