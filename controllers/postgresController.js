const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')

// Database Connection
const { Pool } = require('pg');

/**
 * Heroku Postgres Connectivity Test
 */
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://postgres:${process.env.POSTGRES_PW}@localhost:5432/postgres`,
  ssl: process.env.DATABASE_URL ? true : false
})

/**
 * @description test query against postgres cloud db within HEROKU
 * @type HTTP GET
 * @route /api/postgres
 * @param {*} request
 * @param {*} response
 */
const getAll = asyncHandler(async (request, response) => {
  logger.info("controller received GET to /api/postgres")
  logger.debug(process.env.DATABASE_URL)
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