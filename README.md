# Fiscalismia Backend
Background Service handling the Fiscalismia infrastructure.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments. Advanced capabilities are available for dynamically updating supermarket grocery deals via web automation scraping data from supermarket websites.

## Technical Overview

fiscalismia-backend consists of an express server running a REST API. Requests from the frontend are handled by the backend's REST API querying data from a postgres db. The database runs within a docker container for development. JWT tokens are used for authentication. Local Browser Storage for Session Cookies. The REST API is designed with full CRUD operations in mind, allowing for dynamic user input, sanitized before being commited to the db. In production, we use a cloud-hosted scale-to-zero PostgreSQL database on Neon.tech with a generous free tier. The backend is built in a continuous integration pipeline, tested, scanned for vulnerabilities and published as a docker image to a public docker registry for later deployment in your environment of choice.


## Table of Contents

- [Technologies](#technologies)
- [DevOps Pipeline](#pipeline)
- [Setup](#setup)
- [Usage](#usage)
- [Testing](#testing)
- [Production & Deployment](#production)
- [License](#license)

## Technologies

- **Github Actions:** CI/CD Pipeline for automating type checking, eslint analysis, REST API testing, vulnerability scanning, building, publishing and deploying.
- **Docker:** The final build artifact from compiled src code is a docker image published to a registry and deployed in the cloud.
- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext. Mid-project Migration from plain JavaScript (ECMAScript 2016).
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, used for server-side development.
- **Express Server:** A fast, unopinionated, minimalist web framework for Node.js, used to build the backend server.
- **Supertest:** A testing library for HTTP assertions, employed for REST API testing to ensure the reliability of the server.
- **JWT Auth:** JSON Web Token authentication is used for securing and verifying the authenticity of API requests.
- **Snyk:** Static Code security analysis, dependency security analysis, monitoring and notifications on detected security issues.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.
- **Winston Logger:** A versatile logging library for Node.js, utilized for logging events and errors in the server.
- **Nodemon/ts-node:** Hot Reload upon file changes of the server during development, enhancing the development workflow.

## Pipeline
todo
1. **Test & Analyze**
2. **Build & Publish**
3. **Deploy to Cloud**

## Setup

**Dependencies**

1. **Node.js:** Ensure that Node.js is installed on your local machine, with a minimum version of 20.9. You can download Node.js via Node Version Switcher [here](https://github.com/jasongin/nvs) or directly from the source [here](https://nodejs.org/).

2. **Docker & Docker Compose** Ensure that Docker is installed in your local development environment. Get Docker [here](https://docs.docker.com/get-docker/) and Docker Compose [here](https://docs.docker.com/compose/install/).

3. **Clone the Repository:**
   git clone https://github.com/your-username/fiscalismia-backend.git

**Installation**

1. **Navigate to the Project Folder:**

   ```bash
   cd fiscalismia-backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Store the `.env` in the root folder of `fiscalismia-backend`. Ensure that you never upload this file to Git, as it contains sensitive information!
   `DB_CONNECTION_URL` is only required in production, as this points to the cloud hosted db.
   ```bash
   # App & Server
   JWT_SECRET=
   ADMIN_USER_PW=
   DB_CONNECTION_URL=
   FRONTEND_PORT=3001
   BACKEND_PORT=3002
   HOST_ADDRESS=localhost

   # Local Docker DB Setup
   POSTGRES_USER=fiscalismia_api
   POSTGRES_HOST=fiscalismia-postgres
   POSTGRES_DB=fiscalismia
   POSTGRES_PASSWORD=
   POSTGRES_PORT=5432

   # PIPELINE INTEGRATIONS
   SNYK_TOKEN=
   ```

**Running**

1. **Option 1: Docker Compose**

   To run the entire stack in development mode

   ```bash
   docker compose build
   docker compose up
   ```

2. **Option 2: Locally**

   Development Database
   ```bash
   docker compose up fiscalismia-postgres
   ```

   Run only the backend locally pointing to local db defined in `.env` file keys.
   ```bash
   npm run dev
   ```

3. **Option 3: Docker**

   Development Database
   ```bash
   docker compose up fiscalismia-postgres
   ```

   Run only the backend dev container pointing to local db defined in `.env` file keys. NOTE: volume file paths are Windows specific! They will differ on Linux
   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile.dev" -t fiscalismia-backend-dev:latest "."
   docker run -v %cd%\src:/fiscalismia-backend/src -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend-dev fiscalismia-backend-dev:latest
   ```

   Run only the backend production container pointing to cloud production db. NOTE: volume file paths are Windows specific! They will differ on Linux
   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   docker run --network fiscalismia-network -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```

1. **Start the development DB:**

   ```bash
   docker compose --env-file .env up
   ```

2. **Run the backend either locally or with docker:**

   ```bash
   # Developing locally
   npm run server
   ```


## Usage

Once the server is up and running, it will be ready to handle API requests from your frontend application or REST API Client at http://localhost:3002/api/fiscalismia

**Accessing the Database via CLI**

   ```bash
   docker exec -it YOUR_DOCKER_HASH sh
   psql -U $POSTGRES_USER -d $POSTGRES_DB -h $POSTGRES_HOST -p $POSTGRES_PORT
   ```

**Accessing the Database via DB Client**

   You can run DBeaver or a database client of your choice and use the .env file connection strings

   `POSTGRES_USER | POSTGRES_HOST | POSTGRES_DB | POSTGRES_PASSWORD | POSTGRES_PORT`

**Accessing Protected Routes**

   A valid user is required.
   Default credentials are
   ```admin changeit```

   Alternatively use a POST request to http://localhost:3002/api/fiscalismia/um/credentials carrying a user object.

   ```json
   // the user has to be whitelisted in the db table username_whitelist
   { "username": "yourUser", "email": "user@mailserver.domain", "password": "yourPassword" }
   ```

   User can also be created easily via the **frontend login mask**.

   All important routes are protected and require an Authorization header reading 'Bearer token' where token is a jwt-token received after posting valid user credentials to http://localhost:3002/api/fiscalismia/um/login

   result:
   `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY`

   ```bash
   GET http://localhost:3002/api/fiscalismia/ HTTP/1.1
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY
   ```

## Testing

**All tests generate report files in the `reports/` subdirectory.**

1. **REST API tests /w supertest:**

   We use supertest for testing the REST API which can be executed via running the test script from a second console while the dev database is up and running.

   ```bash
   npm run test
   ```

2. **Static Code Analysis**

   Eslint is used to ensure a consistent codebase adhering to certain coding standards configured in `.eslintrc.js`.
   Typecheck runs the Typescript Compiler which is configured with high strictness in `tsconfig.json`.


   ```bash
   npm run typeCheck
   npm run eslintAnalysis
   ```

3. **Snyk Security Analysis**

   `SNYK_TOKEN` has to be set in `.env` file.
   Get one for free by creating a snyk account [here](https://app.snyk.io/login)

   Vulnerability scanning of both the codebase, especially relevant for issues such as SQL Injection and XSS(Cross Site Scripting).
   ```bash
   npm run snykCodeAnalysis
   npm run snykDependencyAnalysis
   ```

## Production

1. **Set up Cloud DB**

   I recommend using scale-to-zero cloud-native postgresql with a generous free tier at [neon.tech](https://console.neon.tech/)

2. **Build docker image**

   *Hint: %cd% command is unique to windows, in unix based systems current directory is referenced differently*
   ```
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   docker run -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```

3. **Profit**

## License

This project is licensed under the [MIT License](LICENSE).
