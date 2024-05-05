# Fiscalismia Backend

## Overview

The Fiscalismia Backend consists of an Express server running a REST API, handling requests from the frontend and fetching data from a cloud-based PostgreSQL database.
The data hosted is primarily for financial analysis and full CRUD operations are within its feature set.

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [License](#license)

## Technologies

- **TypeScript:** Statically typed JS with high strictness level and compile target ESNext. Mid-project Migration from plain JavaScript (ECMAScript 2016).
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, used for server-side development.
- **Express Server:** A fast, unopinionated, minimalist web framework for Node.js, used to build the backend server.
- **JWT Auth:** JSON Web Token authentication is used for securing and verifying the authenticity of API requests.
- **Jenkins:** A DevOps automation server that orchestrates the development pipeline, helping in building, testing, and deploying the application fully automated.
- **Docker:** Jenkins runs in a Docker container, the pipeline itself uses further containers providing a consistent environment for the entire development workflow.
- **Winston Logger:** A versatile logging library for Node.js, utilized for logging events and errors in the server.
- **Supertest:** A testing library for HTTP assertions, employed for REST API testing to ensure the reliability of the server.
- **Nodemon/ts-node:** Hot Reload upon file changes of the server during development, enhancing the development workflow.
- **ESLint and Prettier:** Linter and Formatter for ensuring code quality and enforcing coding standards.

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
   Request the `.env` file from your administrator and store it in the root folder of `fiscalismia-backend`. Ensure that you never upload this file to Git, as it contains sensitive information!

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
