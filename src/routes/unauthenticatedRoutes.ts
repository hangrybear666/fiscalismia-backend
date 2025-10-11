const unauthenticatedRoutes = require('express').Router();
const { loginWithUserCredentials } = require('../controllers/create_postgresController');
const { createUserCredentialsAndSchema } = require('../controllers/create_postgresUserSchema');
const { getFoodItemImg } = require('../controllers/multerController');

/**
 * Contains the only routes served to non-authenticated users.
 * Serves the purpose of logging in with existing credentials or signing up, creating new credentials.
 */

unauthenticatedRoutes.post('/um/login', loginWithUserCredentials);
unauthenticatedRoutes.post('/um/credentials', createUserCredentialsAndSchema);

/**
 * The Image is queried not via axios but via an url in the src location within the html page
 * And thus no authentication is sent with it.
 */
unauthenticatedRoutes.get('/public/img/uploads/:filepath', getFoodItemImg);

module.exports = unauthenticatedRoutes;
