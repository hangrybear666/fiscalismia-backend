# Fiscalismia Backend
Background Service handling the Fiscalismia infrastructure.
Fiscalismia is a Web Service for visualizing, analyzing, aggregating, importing and exporting personal finance data. Data can consist of variable and fixed costs, income, sales and investments. Advanced capabilities are available for synthesizing supermarket grocery deals.

## Technical Overview

fiscalismia-backend consists of an express server running a REST API. Requests from the frontend are rooted through an nginx reverse proxy to a cloud-hosted scale-to-zero PostgreSQL database on Neon.tech.
JWT tokens are used for authentication. The REST API is designed with full CRUD operations in mind, allowing for dynamic user input, sanitized before being commited to the db.

## Table of Contents

- [Technologies](#technologies)
- [DevOps Pipeline](#pipeline)
- [Setup](#setup)
- [Usage](#usage)
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

2. **Clone the Repository:**
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
   Request the `.env` file from the repository owner and store it in the root folder of `fiscalismia-backend`. Ensure that you never upload this file to Git, as it contains sensitive information!

4. **Run the Server:**

```bash
npm run server
```

## Usage

Once the server is up and running, it will be ready to handle API requests from your frontend application or REST API Client at http://localhost:3002/api/fiscalismia

**Accessing Protected Routes**

A valid user is required. It can be created easily via the **frontend login mask**.

Alternatively use a POST request to http://localhost:3002/api/fiscalismia/um/credentials carrying an object whereas the user has to be whitelisted in the `.env` file

```bash
USERNAME_WHITELIST=admin,testuser
```

```json
{ "username": "testuser", "email": "user@mailserver.domain", "password": "password" }
```

All important routes are protected and require an Authorization header reading 'Bearer token' where token is a jwt-token received after posting valid user credentials to http://localhost:3002/api/fiscalismia/um/login

result:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY`

```bash
GET http://localhost:3002/api/fiscalismia/ HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsInVzZXJFbWFpbCI6ImhlcnBfZGVycEBnbWFpbC5pbyJ9LCJpYXQiOjE3MDczMDk4MTgsImV4cCI6MTcwNzM5NjIxOH0.RkxSnXZZAwHIi-QPR57KtLiVdeRn3FybfPtCosM4rqY
```

## Testing

We use supertest for testing the REST API which can be executed via running the test script from a second console while the server is up and running.

```bash
# have the server running in another console
npm test
```

see REST API examples in `tests\rest_api_playground.http`

see REST API testing in `tests\*_rest_api.test.js`

## License

This project is licensed under the [MIT License](LICENSE).
