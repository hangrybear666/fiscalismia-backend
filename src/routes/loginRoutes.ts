const loginRoutes = require('express').Router();
const { loginWithUserCredentials } = require('../controllers/create_postgresController');
const { createUserCredentialsAndSchema } = require('../controllers/create_postgresUserSchema');

/**
 * Contains the only routes served to non-authenticated users.
 * Serves the purpose of logging in with existing credentials or signing up, creating new credentials.
 */

loginRoutes.post('/um/login', loginWithUserCredentials);
loginRoutes.post('/um/credentials', createUserCredentialsAndSchema);

module.exports = loginRoutes;
