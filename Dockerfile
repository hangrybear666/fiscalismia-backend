#
FROM node:20.12.2-alpine3.19
WORKDIR /fiscalismia-backend/
COPY ./controllers/ ./controllers
COPY ./middleware/ ./middleware
COPY ./models/ ./models
COPY ./routes/ ./routes
COPY ./src/ ./src
COPY ./utils/ ./utils
COPY app.ts server.ts LICENSE package-lock.json package.json tsconfig.json ./
RUN npm install
ENTRYPOINT ["npm", "run", "server"]
# tests folder later for workflow
# public mounten