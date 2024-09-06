# Fiscalismia Backend
Background Service handling the Fiscalismia infrastructure.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments. Advanced capabilities are available for dynamically updating supermarket grocery deals via web automation scraping data from supermarket websites.

## Technical Overview

fiscalismia-backend consists of an express server running a REST API. Requests from the frontend are handled by the backend's REST API querying data from a postgres db. The database runs within a docker container for development. JWT tokens are used for authentication. Local Browser Storage for Session Cookies. The REST API is designed with full CRUD operations in mind, allowing for dynamic user input, sanitized before being commited to the db. In production, we use a cloud-hosted scale-to-zero PostgreSQL database on Neon.tech with a generous free tier. The backend is built in a continuous integration pipeline, tested, scanned for vulnerabilities and published as a docker image to a public docker registry for later deployment in your environment of choice.


## Table of Contents

- [Technologies](#technologies)
- [DevOps Pipeline](#pipeline)
- [Setup](#setup)
- [Running](#running)
- [Testing](#testing)
- [Usage](#usage)
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

1. **Triggers:**
   - Runs on every push and pull request to the `main` branch.

2. **Job: `test`**:
   - **Steps:**
     - Set up Node.js (v20.12.2), install dependencies and Snyk.
     - Run type checks and ESLint analysis.
     - Perform Snyk static code and dependency security analysis.
     - Publish type check, ESLint, and Snyk reports as artifacts.
     - Initialize a fresh Postgres database and seed with DDL/DML scripts.
     - Run API tests against the pipeline database using `supertest`.

3. **Job: `build`**:
   - **Steps:**
     - Build Backend Docker image.
     - Publish Docker image to GHCR (TODO: Switch to AWS ECR)

4. **Job: `deploy`**:
   - **Steps:**
     - TODO: Deploy on EC2 Instance via AWS CLI

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
   JWT_SECRET=xxx
   DB_CONNECTION_URL=
   FRONTEND_PORT=3001
   BACKEND_PORT=3002
   HOST_ADDRESS=localhost

   # Local Docker DB Setup
   POSTGRES_USER=fiscalismia_api
   POSTGRES_HOST=fiscalismia-postgres
   POSTGRES_DB=fiscalismia
   POSTGRES_PASSWORD=xxx
   POSTGRES_PORT=5432

   # PIPELINE INTEGRATIONS
   SNYK_TOKEN=
   ```

4. **Github Secrets:**

   Set up Github Secrets in your Repository Settings, for the pipeline to run successfully. These can and should be the same as in your `.env` file.
   ```bash
   JWT_SECRET
   POSTGRES_PASSWORD
   SNYK_TOKEN
   ```

## Running

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
   npm run server
   ```

3. **Option 3: Docker**

   Development Database
   ```bash
   docker compose up fiscalismia-postgres
   ```

   <details open>
   <summary><b>Docker Run (Linux Syntax)</b></summary>

   Run only the backend dev container pointing to local db defined in `.env` file keys.
   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile.dev" -t fiscalismia-backend-dev:latest "."
   docker run -v $PWD/src:/fiscalismia-backend/src -v $PWD/public:/fiscalismia-backend/public --env-file .env --net fiscalismia-network --rm -it -p 3002:3002 --name fiscalismia-backend-dev fiscalismia-backend-dev:latest
   ```
   </details>
   <details closed>
   <summary><b>Docker Run (Windows Syntax)</b></summary>

   Run only the backend dev container pointing to local db defined in `.env` file keys.
   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile.dev" -t fiscalismia-backend-dev:latest "."
   docker run -v %cd%\src:/fiscalismia-backend/src -v %cd%\public:/fiscalismia-backend/public --env-file .env --net fiscalismia-network --rm -it -p 3002:3002 --name fiscalismia-backend-dev fiscalismia-backend-dev:latest
   ```
   </details>

   ------

   <details closed>
   <summary><b>Production build with cloud database (Linux Syntax)</b></summary>

   NOTE: `DB_CONNECTION_URL` to remote postgres must be set in `.env` file.

   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   docker run --network fiscalismia-network -v $PWD/public:/fiscalismia-backend/public --env-file .env --net fiscalismia-network --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```
   </details>

   ------

   <details closed>
   <summary><b>Production build with cloud database (Windows Syntax)</b></summary>

   NOTE: `DB_CONNECTION_URL` to remote postgres must be set in `.env` file.

   ```bash
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   docker run --network fiscalismia-network -v %cd%\public:/fiscalismia-backend/public --env-file .env --net fiscalismia-network --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```
   </details>

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

   Once per workspace
   ```bash
   # with snyk cli installed
   snyk auth SNYK_TOKEN
   # without snyk cli installed
   npx snyk auth SNYK_TOKEN
   ```

   Vulnerability scanning of both the codebase, especially relevant for issues such as SQL Injection and XSS(Cross Site Scripting).
   ```bash
   npm run snykCodeAnalysis
   npm run snykDependencyAnalysis
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

## Production

1. **Set up Cloud DB**

   I recommend using scale-to-zero cloud-native postgresql with a generous free tier at [neon.tech](https://console.neon.tech/)

2. **Build docker image**

   *Hint: %cd% backslash file path command is unique to windows, in unix based systems, replace it with $PWD forward slash*
   ```
   docker build --pull --no-cache --rm -f "Dockerfile" -t fiscalismia-backend:latest "."
   docker run -v %cd%\public:/fiscalismia-backend/public --env-file .env --rm -it -p 3002:3002 --name fiscalismia-backend fiscalismia-backend:latest
   ```

3. **Automatic Docker Build and Push to private AWS ECR in Github Actions Pipeline**

   Todo

4. **Deployment to public AWS EC2 Instance via Github Actions Pipeline**

   Todo

5. **Provisioning of AWS S3 Bucket for Image Upload**

   Todo

## License

This project is licensed under the [MIT License](LICENSE).
