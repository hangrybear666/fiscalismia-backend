const asyncHandler = require('express-async-handler')
const { parse } = require('csv-parse/sync');
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')
const { buildInsertStagingVariableBills,
        buildInsertFixedCosts,
        buildInsertFixedIncome,
        buildInsertNewFoodItems,
        buildInsertUmUsers,
        buildVerifyUsername,
        buildInitializeUserSettings,
        logSqlStatement } = require('../utils/SQL_UTILS')
const { generateToken } = require('../utils/security')
const config = require('../utils/config')
// const csvjson = require('../postgres-scripts/csvjson.json')

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
  const parameters =  [request.body.description]
  const client = await pool.connect()
  try {
    await client.query('BEGIN') // TODO
    logSqlStatement(sql, parameters)
    const result = await client.query(sql, parameters)
    await client.query('COMMIT') // TODO
    const results = { 'results': (result) ? result.rows : null};
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK') // TODO
    response.status(400)
    error.message = `Transaction ROLLBACK. data could not be inserted. ` + error.message
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description user settings for UPSERT statement of public.um_user_settings
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/settings
 */
const postUpdatedUserSettings = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/upload/um/settings")
  const sql = `
  INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
  VALUES(
    (SELECT id FROM public.um_users WHERE username = $1),
    $2,
    $3,
    NULL
    )
  ON CONFLICT ON CONSTRAINT uk_user_settings
    DO
    UPDATE SET setting_value = EXCLUDED.setting_value
  RETURNING (SELECT username FROM public.um_users WHERE id = (SELECT id FROM public.um_users WHERE username = $1))`
  const userSettingObj = request.body
  const parameters = [
    userSettingObj.username,
    userSettingObj.settingKey,
    userSettingObj.settingValue,
    ]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    logSqlStatement(sql, parameters)
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400)
    error.message = `Transaction ROLLBACK. data could not be inserted. ` + error.message
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description food item discount information object validated and added via frontend
 * contains the following fields:
 * id | price | startDate | endDate
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/upload/food_item_discount
 */
const postFoodItemDiscount = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/upload/food_item_discount")
  const sql = 'INSERT INTO public.food_price_discounts(food_prices_dimension_key, discount_price, discount_start_date, discount_end_date) VALUES($1,$2,$3,$4) RETURNING food_prices_dimension_key'
  const discountInfo = request.body
  const parameters = [
    discountInfo.id,
    discountInfo.price,
    discountInfo.startDate,
    discountInfo.endDate ]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    logSqlStatement(sql, parameters)
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400)
    error.message = `Transaction ROLLBACK. data could not be inserted. ` + error.message
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description food item information object validated and added via frontend
 * contains the following fields:
 * foodItem | brand | store | mainMacro | kcalAmount | weight | price | lastUpdate
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/upload/food_item
 */
const postNewFoodItem = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/upload/food_item")
  let sql = `INSERT INTO public.table_food_prices(dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date) VALUES (
      nextval(\'table_food_prices_seq\'),
      $1, $2, $3, $4, $5, $6, $7, $8,
      current_date,
      to_date(\'01.01.4000\',\'DD.MM.YYYY\')
    ) RETURNING dimension_key`
  const newFoodItem = request.body
  let parameters = [
    newFoodItem.foodItem,
    newFoodItem.brand,
    newFoodItem.store,
    newFoodItem.mainMacro,
    newFoodItem.kcalAmount,
    newFoodItem.weight,
    newFoodItem.price,
    newFoodItem.lastUpdate ]
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    logSqlStatement(sql, parameters)
    const result = await client.query(sql, parameters)
    await client.query('COMMIT')
    const results = { 'results': (result) ? result.rows : null};
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400)
    error.message = `Transaction ROLLBACK. data could not be inserted. ` + error.message
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description receives application/json body to transform into insert queries for ETL
 * FALLBACK to local file system file otherwise
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/json/variable_expenses
 */
 const postVariableExpensesJson = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/json/variable_expenses")
  // Use request.body or a file system file as fallback.
  const jsonData = request.body ? request.body : csvjson
  let insertStatements = ''
  let insertCount = 0
  jsonData.forEach(e => {
    const insertRow = buildInsertStagingVariableBills(e)
    insertStatements = insertStatements.concat(insertRow)
    insertCount++
  });
  logger.debug(`received json-data from body with length [${request.body ? request.body.length : 0 }] and transformed into [${insertCount}] INSERT STATEMENTS`)
  response.status(200).send(insertStatements)
})

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description  category  store cost  date  is_planned  contains_indulgence sensitivities
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/variable_expenses
 */
 const postVariableExpensesTextTsv = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/texttsv/variable_expenses")
  try {
    // Parse text/plain with mandatory headers into JSON
    const result = parse(request.body, {
      columns: true,
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    })
    let insertStatements = ''
    let insertCount = 0
    result.forEach(e => {
      const insertRow = buildInsertStagingVariableBills(e)
      insertStatements = insertStatements.concat(insertRow)
      insertCount++
    })
    logger.debug(`received tsv-data from body with [${request.body ? result.length : 0 }] rows and transformed into [${insertCount}] INSERT STATEMENTS`)
    response.status(200).send(insertStatements)
  } catch (error) {
    response.status(400)
    error.message = `the provided text/plain data could not be converted to .csv or the following INSERT Statements. ` + error.message
    throw error
  }
})

/**
 * @description receives comma-separated value as file in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description  category  store cost  date  is_planned  contains_indulgence sensitivities
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/csv/variable_expenses
 */
 const postVariableExpensesCsv = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/csv/variable_expenses")
  try {
    // Parse csv file with mandatory headers into JSON
    // const result = parse(request.body, {
    //   columns: true,
    //   delimiter: ',',
    //   trim: true,
    //   skip_empty_lines: true
    // })
    // let insertStatements = ''
    // let insertCount = 0
    // result.forEach(e => {
    //   const insertRow = buildInsertIntoStagingVariableBills(e)
    //   insertStatements = insertStatements.concat(insertRow)
    //   insertCount++
    // })
    // logger.debug(`received csv-file from body with [${request.body ? result.length : 0 }] rows and transformed into [${insertCount}] INSERT STATEMENTS`)
    // response.status(200).send(insertStatements)
  } catch (error) {
    response.status(400)
    error.message = `the provided text/plain data could not be converted to .csv or the following INSERT Statements. ` + error.message
    throw error
  }
})

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_costs
 * @returns INSERT INTO statements in response
 */
 const postFixedCostsTextTsv = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/texttsv/fixed_costs")
  try {
    // Parse text/plain with mandatory headers into JSON
    const result = parse(request.body, {
      columns: true,
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    })
    let insertStatements = ''
    let insertCount = 0
    result.forEach(e => {
      const insertRow = buildInsertFixedCosts(e)
      insertStatements = insertStatements.concat(insertRow)
      insertCount++
    })
    logger.debug(`received tsv-data from body with [${request.body ? result.length : 0 }] rows and transformed into [${insertCount}] INSERT STATEMENTS`)
    response.status(200).send(insertStatements)
  } catch (error) {
    response.status(400)
    error.message = `the provided text/plain data could not be converted into INSERT Statements. ` + error.message
    throw error
  }
})


/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_income
 * @returns INSERT INTO statements in response
 */
const postIncomeTextTsv = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/texttsv/fixed_income")
  try {
    // Parse text/plain with mandatory headers into JSON
    const result = parse(request.body, {
      columns: true,
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    })
    let insertStatements = ''
    let insertCount = 0
    result.forEach(e => {
      const insertRow = buildInsertFixedIncome(e)
      insertStatements = insertStatements.concat(insertRow)
      insertCount++
    })
    logger.debug(`received tsv-data from body with [${request.body ? result.length : 0 }] rows and transformed into [${insertCount}] INSERT STATEMENTS`)
    response.status(200).send(insertStatements)
  } catch (error) {
    response.status(400)
    error.message = `the provided text/plain data could not be converted into INSERT Statements. ` + error.message
    throw error
  }
})

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/new_food_items
 * @returns INSERT INTO statements in response
 */
const postNewFoodItemsTextTsv = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/texttsv/new_food_items")
  try {
    // Parse text/plain with mandatory headers into JSON
    const result = parse(request.body, {
      columns: true,
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    })
    let insertStatements = ''
    let insertCount = 0
    result.forEach(e => {
      const insertRow = buildInsertNewFoodItems(e)
      insertStatements = insertStatements.concat(insertRow)
      insertCount++
    })
    logger.debug(`received tsv-data from body with [${request.body ? result.length : 0 }] rows and transformed into [${insertCount}] INSERT STATEMENTS`)
    response.status(200).send(insertStatements)
  } catch (error) {
    response.status(400)
    error.message = `the provided text/plain data could not be converted into INSERT Statements. ` + error.message
    throw error
  }
})

/**
 * @description expects a application/json request.body containing username and password keys
 * destined for INSERTION into encrypted credential storage within database
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/credentials
 */
const createUserCredentials = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/um/credentials")
  const credentials = {
    username : request.body.username,
    email : request.body.email,
    password : request.body.password
  }
  const regExOnlyLettersAndHyphensDotsUnderscores = /^[A-Za-z_.-]*$/g
  const regExAlphaNumeric = /^[a-zA-Z0-9._-]*$/g
  const regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!credentials.username || !credentials.password || !credentials.email) {
    logger.debug("username, email or password not provided in request.body")
    response.status(400)
    throw new Error(`username, email and/or password missing in POST request`)
  }
  if (!regExOnlyLettersAndHyphensDotsUnderscores.test(credentials.username)) {
    logger.debug(`username did not match latin alphabet regex pattern ${regExOnlyLettersAndHyphensDotsUnderscores}`)
    response.status(400)
    throw new Error(`username must conform to the latin alphabet!`)
  }
  if (!regExEmail.test(credentials.email)) {
    logger.debug(`email did not match the chromium email regex pattern ${regExEmail}`)
    response.status(400)
    throw new Error(`email must conform to the Chromium email standard such as example_1@domain.xyz!`)
  }
  if(!regExAlphaNumeric.test(credentials.password)) {
    logger.debug(`password did not match the alphanumeric regex pattern ${regExAlphaNumeric}`)
    response.status(400)
    throw new Error(`password must contain alphanumeric characters, hyphens or underscores only!`)
  }
  if(!config.USERNAME_WHITELIST.includes(credentials.username)) {
    logger.debug(`username ${credentials.username} is not whitelisted! 
    whitelist is as follows:
    ${config.USERNAME_WHITELIST}`)
    response.status(400)
    throw new Error(`username not whitelisted. Please contact your administrator to gain access.`)
  }
  const sqlInsertCredentials = buildInsertUmUsers(credentials)
  const sqlVerifyCredentials = buildVerifyUsername(credentials)
  const sqlInsertSettingsForNewUser = buildInitializeUserSettings(credentials)
  const parameters = ''
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    logSqlStatement(sqlInsertCredentials,parameters)
    await client.query(sqlInsertCredentials, parameters)
    logSqlStatement(sqlVerifyCredentials,parameters)
    const result = await client.query(sqlVerifyCredentials, parameters)
    const results = { 'results': (result) ? result.rows : null};
    if (result.rowCount != 1) {
      throw new Error(`user could not be uniquely identified`)
    }
    if (results.rows
      && results.rows.length > 0
      && results.rows[0].username
      && results.rows[0].username !== credentials.username) {
      throw new Error(`username provided does not match username in database`)
    }
    await client.query(sqlInsertSettingsForNewUser, parameters)
    logSqlStatement(sqlInsertSettingsForNewUser,parameters)
    await client.query('COMMIT')
    response.status(201).send(results)
  } catch (error) {
    await client.query('ROLLBACK')
    response.status(400)
    error.message = 'Transaction ROLLBACK: user credentials could not be stored in the database. ' + error.message
    throw error
  } finally {
    client.release();
  }
})

/**
 * @description expects a application/json request.body containing username and password keys
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/login
 */
 const loginWithUserCredentials = asyncHandler(async (request, response) => {
  logger.info("create_postgresController received POST to /api/fiscalismia/um/login")
  const credentials = {
    username : request.body.username,
    password : request.body.password
  }
  if (!credentials.username || !credentials.password) {
    response.status(400)
    throw new Error(`username and/or password not provided in request.body`)
  }
  const sql = buildVerifyUsername(credentials)
  const parameters = ''
  const client = await pool.connect()
  try {
    logSqlStatement(sql,parameters)
    const result = await client.query(sql, parameters)
    if (result.rowCount != 1) {
      response.status(400)
      throw new Error(`Login failed. SELECT to verify user credentials returns rowcount of [${result.rowCount}]`)
    }
    const results = { 'rows': (result) ? result.rows : null};
    if (results.rows[0]?.username
      && results.rows[0]?.username !== credentials.username) {
      response.status(400)
      throw new Error(`Login failed. username from request.body and database query do not match`)
    }
    const user = {
      userId: results.rows[0]?.userid,
      userName: results.rows[0]?.username,
      userEmail: results.rows[0]?.useremail
    }
    const jwtToken = generateToken(user)
    response.status(200).send(jwtToken)
  } catch (error) {
    response.status(400)
    error.message = `Login failed. User could not be verified. ` + error.message
    throw error
  } finally {
    client.release();
  }
 })



module.exports = {
  postTestData,

  postFoodItemDiscount,
  postNewFoodItem,
  postNewFoodItemsTextTsv,

  postVariableExpensesJson,
  postVariableExpensesTextTsv,
  postVariableExpensesCsv,

  postFixedCostsTextTsv,
  postIncomeTextTsv,

  createUserCredentials,
  loginWithUserCredentials,
  postUpdatedUserSettings,
}
