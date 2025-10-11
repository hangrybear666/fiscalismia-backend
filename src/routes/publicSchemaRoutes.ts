const publicSchemaRoutes = require('express').Router();
const { getUserSpecificSettings } = require('../controllers/read_postgresController');
const { postUpdatedUserSettings } = require('../controllers/create_postgresController');

/**
 * Contains routes available to authenticated users targeted towards the public database schema.
 * The public database schema is shared between all users of the database.
 */

publicSchemaRoutes.post('/um/settings', postUpdatedUserSettings);
publicSchemaRoutes.get('/um/settings/:username', getUserSpecificSettings);

module.exports = publicSchemaRoutes;
