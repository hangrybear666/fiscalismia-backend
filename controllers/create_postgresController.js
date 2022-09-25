const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')
const csvjson = require('../postgres-scripts/csvjson.json')

/***
 *    ______ _____ _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    | ___ \  _  /  ___|_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |_/ / | | \ `--.  | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    |  __/| | | |`--. \ | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |   \ \_/ /\__/ / | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    \_|    \___/\____/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test query posting data into test_table
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/
 */
 const postTestData = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/")
  const sql = 'INSERT INTO test_table(description) VALUES($1) RETURNING description'
  const parameters =  [request.body.name]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400).send()
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description receives json-file to transform into insert queries for ETL
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/json/variable_expenses
 */
 const postVariableExpensesJson = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/json/variable_expenses")
  csvjson.forEach(e => {
    logger.warn(`INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
    VALUES (
      '${e.description}',
      INITCAP('${e.category}'),
      INITCAP('${e.store}'),
      ${e.cost},
      TO_DATE('${e.date}','DD.MM.YYYY'),
      '${e.is_planned}',
      '${e.contains_indulgence}',
      LOWER('${e.sensitivities}')
    );`)
  });
  response.status(200).json(csvjson).send()
})

module.exports = {
  postTestData,
  postVariableExpensesJson
}