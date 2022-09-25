const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')

/***
 *     _____  _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    |  __ \|  ___|_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |  \/| |__   | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    | | __ |  __|  | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |_\ \| |___  | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *     \____/\____/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test query fetching data from test_table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia
 */
const getTestData = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM test_table ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all data from category table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/category
 */
 const getAllCategories = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/category")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM category ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all data from store table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/store
 */
 const getAllStores = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/store")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM store ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all data from sensitivity table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivity
 */
 const getAllSensisitivies = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/sensitivity")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM sensitivity ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all data from variable_expenses table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/variable_expenses
 */
 const getAllVariableExpenses = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/variable_expenses")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM variable_expenses ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all data from variable_expenses table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase
 */
 const getAllSensitivitiesOfPurchase = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})


/**
 * @description query fetching specific data from category table based on provided id
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/category/:id
 */
 const getCategoryById = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/category/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM category WHERE id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from store table based on provided id
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/store/:id
 */
 const getStoreById = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/store/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM store WHERE id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from sensitivity table based on provided id
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivity/:id
 */
 const getSensisityById = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/sensitivity/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM sensitivity WHERE id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from variable_expenses table based on provided id
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/variable_expenses/:id
 */
 const getVariableExpenseById = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/variable_expenses/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM variable_expenses WHERE id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from bridge_var_exp_sensitivity table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase/sensitivity/:id
 */
 const getSensitivitiesOfPurchaseyBySensitivityId = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase/sensitivity/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity WHERE sensitivity_id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from bridge_var_exp_sensitivity table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/sensitivities_of_purchase/var_expense/:id
 */
 const getSensitivitiesOfPurchaseyByVarExpenseId = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/sensitivities_of_purchase/var_expense/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM bridge_var_exp_sensitivity WHERE variable_expense_id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

module.exports = {
  getTestData,
  getAllCategories,
  getAllStores,
  getAllSensisitivies,
  getAllVariableExpenses,
  getAllSensitivitiesOfPurchase,

  getCategoryById,
  getStoreById,
  getSensisityById,
  getVariableExpenseById,
  getSensitivitiesOfPurchaseyBySensitivityId,
  getSensitivitiesOfPurchaseyByVarExpenseId
}