const publicRoutes = require('express').Router();
const { getUserSpecificSettings } = require('../controllers/read_postgresController');
const { postUpdatedUserSettings } = require('../controllers/create_postgresController');

/**
 * Contains routes available to authenticated users targeted towards the public database schema.
 * The public database schema is shared between all users of the database.
 */

publicRoutes.post('/um/settings', postUpdatedUserSettings);
publicRoutes.get('/um/settings/:username', getUserSpecificSettings);

module.exports = publicRoutes;
