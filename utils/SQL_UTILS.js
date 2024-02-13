const logger = require("./logger")

/**
 * @description replaces all occurences of single quote ' with two single quotes ''
 * @param {*} string
 * @returns escaped string unless the string contains multiple sequential single quotes
 */
const escapeSingleQuotes = (str) => {
  const doubleQuote = '\'\''
  if (str.includes(doubleQuote)) {
    logger.warn('double single quotes present. no escaping performed.')
    return str
  }
  return str.replace(/'/g, doubleQuote)
}

/**
 * @description constructs INSERT INTO statement for credential storage
 * @param {*} param0 json object containing username, email and password keys
 * @returns INSERT INTO SQL for public.um_users
 */
const buildInsertUmUsers = ({username, email, password}) => {
  return `INSERT INTO public.um_users (username, email, password) VALUES (
    '${username}',
    '${email}',
    crypt('${password}', gen_salt('bf',12))
  );`
}

/**
 * @description constructs SELECT statement for credential verification
 * @param {*} param0 json object containing username, email and password keys
 * @returns SELECT FROM SQL for public.um_users
 */
 const buildVerifyUsername = ({username, password}) => {
  return `
  SELECT
    id as userid,
    username,
    email as useremail
  FROM public.um_users
  WHERE username = '${username}'
    AND password = crypt('${password}', password);`
}

/**
 * inserts default values for various user settings after new account creation
 * @param {*} param0 json object containing username, email and password keys
 * @returns INSERT INTO statements for um_user_settings
 */
const buildInitializeUserSettings = ({username}) => {
  return `
  INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = '${username}'),
        'selected_mode',
        'light',
        null);
    INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = '${username}'),
        'selected_palette',
        'default',
        null);`
}

/**
 * @description constructs SELECT statement for finding a user by id
 * @param {*} param0 the user id to be found
 * @returns SELECT FROM SQL for public.um_users
 */
 const buildFindUserById = (id) => {
  return `
  SELECT
    id as userid,
    username,
    email as useremail
  FROM public.um_users
  WHERE id = ${id};`
}

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities
 * @returns INSERT INTO SQL for staging.staging_variable_bills
 */
const buildInsertStagingVariableBills = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  // replaced € in cost with empty string
  // replaced , in cost with empty string as it is a thousand separator
  const insertRow = `INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
      VALUES (
        '${e.description}',
        INITCAP('${e.category}'),
        INITCAP('${e.store}'),
        ${e.cost.replace(/[\u20AC]/g,"").replace(",","")},
        TO_DATE('${e.date}','DD.MM.YYYY'),
        '${e.is_planned}',
        '${e.contains_indulgence}',
        LOWER('${e.sensitivities}')
      );
      `
      return insertRow
}

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * category description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date
 * @returns INSERT INTO SQL for public.fixed_costs
 */
 const buildInsertFixedCosts = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  const insertRow = `INSERT INTO public.fixed_costs (category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date)
      VALUES (
        '${e.category}',
        '${e.description}',
        ${e.monthly_interval},
        ${e.billed_cost},
        ${e.monthly_cost},
        TO_DATE('${e.effective_date}','DD.MM.YYYY'),
        TO_DATE('${e.expiration_date}','DD.MM.YYYY')
      );
      `
      return insertRow
}

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @returns INSERT INTO SQL for public.fixed_income
 */
const buildInsertFixedIncome = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  const insertRow = `INSERT INTO public.fixed_income (description, type, monthly_interval, value, effective_date, expiration_date)
      VALUES (
        '${e.description}',
        '${e.type}',
        ${e.monthly_interval},
        ${e.value},
        TO_DATE('${e.effective_date}','DD.MM.YYYY'),
        TO_DATE('${e.expiration_date}','DD.MM.YYYY')
      );
      `
      return insertRow
}


/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date
 * @returns INSERT INTO SQL for public.investments
 */
const buildInsertInvestments = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  const insertRow = `INSERT INTO public.investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
      VALUES (
        '${e.execution_type}',
        '${e.description}',
        '${e.isin}',
        '${e.investment_type}',
        '${e.marketplace}',
        ${e.units},
        ${e.price_per_unit},
        ${e.total_price},
        ${e.fees},
        TO_DATE('${e.execution_date}','DD.MM.YYYY')
      );
      `
      return insertRow
}

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} element json encoded single element containing the mandatory keys:
 * category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date
 * @returns INSERT INTO SQL for public.table_food_prices
 */
const buildInsertNewFoodItems = (element) => {
  let e = element

  // loops through keys of json object and sanitizes inputs
  for (let key in e) {
      if (e.hasOwnProperty(key)) {
        e[key] = escapeSingleQuotes(String(e[key]))
      }
  }
  const insertRow = `INSERT INTO public.table_food_prices (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
      VALUES (
        nextval('table_food_prices_seq'),
        '${e.food_item}',
        '${e.brand}',
        '${e.store}',
        '${e.main_macro}',
        ${e.kcal_amount},
        ${e.weight},
        ${e.price},
        TO_DATE('${e.last_update}','DD.MM.YYYY'),
        current_date,
        TO_DATE('01.01.4000','DD.MM.YYYY')
      );
      `
      return insertRow
}

/**
 * UPSERT STATEMENT Inserting or Updating an image filepath after the
 * image corresponding to a food item with the id element.id has been stored on the server
 * @param {*} element object containing id and filepath fields
 * @returns UPSERT Statement
 */
const buildInsertFoodItemImgFilePath = (element) => {
  const dimensionKey = element.id;
  const filepath = element.filepath;
  const insertFilePath = `INSERT INTO public.food_price_image_location 
    (food_prices_dimension_key, filepath) 
    VALUES ('${dimensionKey}','${filepath}')
    ON CONFLICT ON CONSTRAINT food_price_filepaths_pkey
    DO
      UPDATE SET filepath = EXCLUDED.filepath;`
  return insertFilePath
}

/**
 * @description Debug logging for SQL Queries executed by the backend server
 * @param {*} sql SQL Statement
 * @param {*} parameters Paramaters for SQL Statement
 */
const logSqlStatement = (sql, parameters) => {
  logger.debug(
    `--SQL
    [QUERY]
    ${sql}

    [PARAMTERS]
    ${parameters ? parameters : 'empty'}`
  )
}

module.exports = {
  buildInsertStagingVariableBills,
  buildInsertFixedCosts,
  buildInsertFixedIncome,
  buildInsertInvestments,
  buildInsertFoodItemImgFilePath,
  buildInsertNewFoodItems,
  buildInsertUmUsers,
  buildInitializeUserSettings,
  buildVerifyUsername,
  buildFindUserById,
  logSqlStatement
}