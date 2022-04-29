const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')

// Database Connection
const { Pool } = require('pg');

/**
 * When deployed DATABASE_URL is fetched from heroku config
 * When testing locally the database URL is constructed from environment variables pointing to a local windows installation
 */
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgresql://${process.env.POSTGRES_USER_LOCAL}:${process.env.POSTGRES_PW_LOCAL}@localhost:${process.env.POSTGRES_PORT_LOCAL}/postgres`,
  ssl: process.env.DATABASE_URL ? {rejectUnauthorized: false} : false
})

/**
 * @description test query against postgres db
 * @type HTTP GET
 * @route /api/postgres
 * @param {*} request
 * @param {*} response
 */
const getAll = asyncHandler(async (request, response) => {
  logger.info("controller received GET to /api/postgres")
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    response.send(200, results );
    client.release();
  } catch (err) {
    logger.error(err);
    response.send( {error: err ? err : null});
  }
})

module.exports = {
  getAll
}