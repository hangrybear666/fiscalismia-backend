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
 * @description query fetching all data from fixed_costs table
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs
 */
 const getAllFixedCosts = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/fixed_costs")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})


/**
 * @description query fetching all data from v_food_price_overview
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_prices_and_discounts
 */
const getAllFoodPricesAndDiscounts = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/food_prices_and_discounts")
  const client = await pool.connect();
  const result = await client.query('SELECT distinct id, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date, weight_per_100_kcal, price_per_kg, normalized_price, filepath FROM v_food_price_overview WHERE current_date BETWEEN effective_date and expiration_date ORDER BY id');
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching all discounted foods from v_food_price_overview
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/discounted_foods_current
 */
const getCurrentlyDiscountedFoodPriceInformation = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/discounted_foods_current")
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM v_food_price_overview WHERE discount_price IS NOT NULL AND discount_end_date >= current_date ORDER BY id');
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
 const getSensitivityById = asyncHandler(async (request, response) => {
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
 * @description query fetching specific data from fixed_costs table based on provided id
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs/:id
 */
 const getFixedCostById = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/fixed_costs/" + request.params.id)
  const id = request.params.id;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs WHERE id = $1', [id]);
  const results = { 'results': (result) ? result.rows : null};
  response.status(200).send(results);
  client.release();
})

/**
 * @description query fetching specific data from fixed_costs table based on provided date
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/fixed_costs/valid/:date
 * @returns list of valid fixed costs at a specific provided date
 */
 const getFixedCostsByEffectiveDate = asyncHandler(async (request, response) => {
  logger.info("read_postgresController received GET to /api/fiscalismia/fixed_costs/valid/" + request.params.date)
  const date = request.params.date;
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM fixed_costs WHERE $1 BETWEEN effective_date AND expiration_date', [date]);
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
  getAllFixedCosts,
  getAllFoodPricesAndDiscounts,
  getCurrentlyDiscountedFoodPriceInformation,
  getAllSensitivitiesOfPurchase,

  getCategoryById,
  getStoreById,
  getSensitivityById,
  getVariableExpenseById,
  getFixedCostById,
  getFixedCostsByEffectiveDate,
  getSensitivitiesOfPurchaseyBySensitivityId,
  getSensitivitiesOfPurchaseyByVarExpenseId
}