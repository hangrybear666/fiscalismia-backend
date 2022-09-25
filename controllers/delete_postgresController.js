const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')

/***
 *    ______ _____ _      _____ _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    |  _  \  ___| |    |  ___|_   _|  ___|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | | | | |__ | |    | |__   | | | |__     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    | | | |  __|| |    |  __|  | | |  __|    |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |/ /| |___| |____| |___  | | | |___    | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    |___/ \____/\_____/\____/  \_/ \____/    \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test request using DELETE to delete the row with :id from test_table
 * @type HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/:id
 */
 const deleteTestData = asyncHandler(async (request, response) => {
  logger.info("delete_postgresController received DELETE to /api/fiscalismia/" + request.params.id)
  const sql = 'DELETE FROM test_table  WHERE id = $1 RETURNING description'
  const parameters =  [request.params.id]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(200).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400).send()
    throw error
  } finally {
    client.release();
  }
})

module.exports = {
  deleteTestData
}