const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')

/***
 *    ______ _   _ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    | ___ \ | | |_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |_/ / | | | | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    |  __/| | | | | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |   | |_| | | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    \_|    \___/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test request using PUT to update the description field of test_table returning the new name
 * @type HTTP PUT
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/:id
 */
 const updateTestData = asyncHandler(async (request, response) => {
  logger.info("update_postgresController received PUT to /api/fiscalismia/" + request.params.id)
  const sql = 'UPDATE test_table SET description = $1 WHERE id = $2 RETURNING description'
  const parameters =  [request.body.name, request.params.id]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(200).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400)
    throw error
  } finally {
    client.release();
  }
})

module.exports = {
  updateTestData
}