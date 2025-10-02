const logger = require('./logger');
import {
  UserCredentials,
  StagingVariableBills,
  FixedCosts,
  FixedIncome,
  InvestmentAndTaxes,
  FoodItem
} from './customTypes';

/**
 * @description replaces all occurences of single quote ' with two single quotes ''
 * @param {*} str
 * @returns escaped string unless the string contains multiple sequential single quotes
 */
const escapeSingleQuotes = (str: string) => {
  // eslint-disable-next-line quotes
  const doubleQuote = "''";
  if (str.includes(doubleQuote)) {
    logger.error('double single quotes present. no escaping performed.');
    throw new Error('Double quotes present on DB INSERT of VARCHAR --> data inconsistency disallowed');
  }
  return str.replace(/'/g, doubleQuote);
};

/**
 * @description constructs INSERT INTO statement for credential storage
 * @param {*} param0 json object containing username, email, schema and password keys
 * @returns INSERT INTO SQL for public.um_users
 */
const buildInsertUmUsers = ({ username, email, password }: UserCredentials) => {
  return `INSERT INTO public.um_users (username, email, password, schema) VALUES (
    '${username}',
    '${email}',
    crypt('${password}', gen_salt('bf',12)),
    'private_${username.toLowerCase()}'
  );`;
};

/**
 * @description constructs SELECT statement for credential verification
 * @param {*} param0 json object containing username, email and password keys
 * @returns SELECT FROM SQL for public.um_users
 */
const buildVerifyUsername = ({ username, password }: UserCredentials) => {
  return `
  SELECT
    id as userid,
    username,
    email as useremail,
    schema as userschema
  FROM public.um_users
  WHERE username = '${username}'
    AND password = crypt('${password}', password);`;
};

/**
 * inserts default values for various user settings after new account creation
 * @param {*} param0 json object containing username, email and password keys
 * @returns INSERT INTO statements for um_user_settings
 */
const buildInitializeUserSettings = ({ username }: UserCredentials) => {
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
        null);
  INSERT INTO public.um_user_settings(
    user_id, setting_key, setting_value, setting_description)
    VALUES (
        (SELECT id FROM public.um_users WHERE username = '${username}'),
        'selected_language',
        'en_US',
        null);
    `;
};

/**
 * @description constructs SELECT statement for finding a user by id
 * @param {number} id the user id to be found
 * @returns SELECT FROM SQL for public.um_users
 */
const buildFindUserById = (id: number) => {
  return `
  SELECT
    id as userid,
    username,
    email as useremail,
    schema as userschema
  FROM public.um_users
  WHERE id = ${id};`;
};

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} e json encoded single element containing the mandatory keys:
 * description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities
 * @returns INSERT INTO SQL for staging.staging_variable_bills
 */
const buildInsertStagingVariableBills = (e: StagingVariableBills) => {
  // loops through keys of json object and sanitizes inputs
  for (const keyname in e) {
    if (typeof e[keyname] === 'string' && !keyname.includes('date')) {
      e[keyname] = escapeSingleQuotes(String(e[keyname]));
    }
  }

  // replaced € in cost with empty string
  // replaced , in cost with empty string as it is a thousand separator
  const insertRow = `INSERT INTO staging.staging_variable_bills (description, category, store, cost, purchasing_date, is_planned, contains_indulgence, sensitivities)
      VALUES (
        '${e.description}',
        INITCAP('${e.category}'),
        INITCAP('${e.store}'),
        ${e.cost},
        TO_DATE('${e.purchasing_date}','DD.MM.YYYY'),
        '${e.is_planned}',
        '${e.contains_indulgence}',
        LOWER('${e.sensitivities}')
      );
      `;
  return insertRow;
};

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {*} e json encoded single element containing the mandatory keys:
 * category description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date
 * @returns INSERT INTO SQL for public.fixed_costs
 */
const buildInsertFixedCosts = (e: FixedCosts) => {
  // loops through keys of json object and sanitizes inputs
  for (const keyname in e) {
    if (typeof e[keyname] === 'string' && !keyname.includes('date')) {
      e[keyname] = escapeSingleQuotes(String(e[keyname]));
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
      `;
  return insertRow;
};

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {FixedIncome} e json encoded single element containing the mandatory keys:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @returns INSERT INTO SQL for public.fixed_income
 */
const buildInsertFixedIncome = (e: FixedIncome) => {
  // loops through keys of json object and sanitizes inputs
  for (const keyname in e) {
    if (typeof e[keyname] === 'string' && !keyname.includes('date')) {
      e[keyname] = escapeSingleQuotes(String(e[keyname]));
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
      `;
  return insertRow;
};

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {InvestmentAndTaxes} e json encoded single element containing the mandatory keys:
 * execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date, pct_of_profit_taxed, profit_amt
 * @returns INSERT INTO SQL for public.investments
 */
const buildInsertInvestments = (e: InvestmentAndTaxes) => {
  // loops through keys of json object and sanitizes inputs
  for (const keyname in e) {
    if (typeof e[keyname] === 'string' && !keyname.includes('date')) {
      e[keyname] = escapeSingleQuotes(String(e[keyname]));
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
${
  e.execution_type === 'sell'
    ? `INSERT INTO public.investment_taxes (investment_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
      (
        SELECT
          id,
          ${e.pct_of_profit_taxed},
          ${e.profit_amt},
          ${(((e.profit_amt! * e.pct_of_profit_taxed!) / 100) * Number(0.26375)).toFixed(2)},
          extract( year FROM TO_DATE('${e.execution_date}','DD.MM.YYYY') )::int
        FROM public.investments
        WHERE isin = '${e.isin}'
          AND execution_date = TO_DATE('${e.execution_date}','DD.MM.YYYY')
          AND execution_type = '${e.execution_type}' --unique key of public.investments
      );
`
    : ''
}`;
  return insertRow;
};

/**
 * @description constructs INSERT INTO statement while sanitizing values of provided json object by e.g.
 * 1) casting all values within json to String for proper escaping via helper method
 * 2) replacing all occurences of single quotes ' with two single quotes ''
 * @param {FoodItem} e json encoded single element containing the mandatory keys:
 * category, description, monthly_interval, billed_cost, monthly_cost, effective_date, expiration_date
 * @returns INSERT INTO SQL for public.table_food_prices
 */
const buildInsertNewFoodItems = (e: FoodItem) => {
  // loops through keys of json object and sanitizes inputs
  for (const keyname in e) {
    if (typeof e[keyname] === 'string' && !keyname.includes('date')) {
      e[keyname] = escapeSingleQuotes(String(e[keyname]));
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
      `;
  return insertRow;
};

/**
 * UPSERT STATEMENT Inserting or Updating an image filepath after the
 * image corresponding to a food item with the id element.id has been stored on the server
 * @param {*} element object containing id and filepath fields
 * @returns UPSERT Statement
 */
const buildInsertFoodItemImgFilePath = (element: any) => {
  const dimensionKey = element.id;
  const filepath = element.filepath;
  const insertFilePath = `INSERT INTO public.food_price_image_location
    (food_prices_dimension_key, filepath)
    VALUES ('${dimensionKey}','${filepath}')
    ON CONFLICT ON CONSTRAINT food_price_filepaths_pkey
    DO
      UPDATE SET filepath = EXCLUDED.filepath;`;
  return insertFilePath;
};

/**
 * @description Debug logging for SQL Queries executed by the backend server
 * @param {*} sql SQL Statement
 * @param {*} parameters Paramaters for SQL Statement
 */
const logSqlStatement = (sql: string, parameters: any) => {
  logger.debug(
    `--SQL
    [QUERY]
    ${sql}

    [PARAMTERS]
    ${parameters ? parameters : 'empty'}`
  );
};

/**
 * Inserts parameters (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
 * into test_table
 * @returns id (of investment)
 */
const insertIntoTestTable = `INSERT INTO test_table
(description)
  VALUES (
    $1
  ) RETURNING id`;

/**
 * Inserts parameters (user_id, setting_key, setting_value, setting_description)
 * into public.um_user_settings
 * @returns username
 */
const insertIntoUserSettings = `INSERT INTO public.um_user_settings
(user_id, setting_key, setting_value, setting_description)
  VALUES(
    (SELECT id FROM public.um_users WHERE username = $1),
    $2,
    $3,
    NULL
    )
  ON CONFLICT ON CONSTRAINT uk_user_settings
    DO
    UPDATE SET setting_value = EXCLUDED.setting_value
  RETURNING (SELECT username FROM public.um_users WHERE id = (SELECT id FROM public.um_users WHERE username = $1)) as username`;

/**
 * Inserts parameters (food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
 * into public.food_price_discounts
 * @returns food_prices_dimension_key
 */
const insertIntoFoodItemDiscount = `INSERT INTO public.food_price_discounts
(food_prices_dimension_key, discount_price, discount_start_date, discount_end_date)
  VALUES(
    $1,$2,$3,$4
  ) RETURNING food_prices_dimension_key as id`;

/**
 * Inserts parameters (dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
 * into public.table_food_prices
 * @returns dimension_key as id
 */
const insertNewFoodItemIntoFoodPrices = `INSERT INTO public.table_food_prices
(dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date)
VALUES (
      nextval('table_food_prices_seq'),
      $1, $2, $3, $4, $5, $6, $7, $8,
      current_date,
      to_date('01.01.4000','DD.MM.YYYY')
    ) RETURNING dimension_key as id`;

/**
 * Inserts parameters (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
 * into public.investments
 * @returns id (of investment)
 */
const insertIntoInvestments = `INSERT INTO public.investments
(execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
  VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING id`;

/**
 * Inserts parameters (isin, dividend_amount, dividend_date)
 * into public.investment_dividends
 * @returns id (of dividend)
 */
const insertIntoInvestmentDividends = `INSERT INTO public.investment_dividends
(isin, dividend_amount, dividend_date)
VALUES(
    $1, $2, $3
  ) RETURNING id`;

/**
 * Inserts parameters (dividend_id | investment_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year) into public.investment_taxes
 * @param {'dividend' | 'investment'} id_type can insert either an investment or a dividend
 * @returns investment_id or dividend_id as id
 */
const insertIntoInvestmentTaxes = (id_type: 'dividend' | 'investment') => {
  return `INSERT INTO public.investment_taxes
(${id_type == 'dividend' ? 'dividend_id' : 'investment_id'}, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
VALUES (
    $1, $2, $3, $4, $5
  ) RETURNING ${id_type == 'dividend' ? 'dividend_id' : 'investment_id'} as id`;
};

/**
 * Inserts parameters (investment_id, dividend_id, remaining_units)
 * into public.bridge_investment_dividends
 * @returns investment_id as id, remaining_units
 */
const insertIntoBridgeInvestmentDividends = `INSERT INTO public.bridge_investment_dividends
(investment_id, dividend_id, remaining_units)
VALUES %L RETURNING investment_id as id, remaining_units`; // using pg-format for bulk insertion

/**
 * Deletes 1-n rows by supplying dimension_key (which can appear multiple times - PK is composite key with effective_date)
 * from public.table_food_prices
 * @returns dimension_key as id
 */
const deleteFoodItemById = `DELETE FROM
public.table_food_prices
WHERE dimension_key = $1
RETURNING dimension_key as id`;

/**
 * Deletes investment by id
 * from public.investments
 * @returns id
 */
const deleteInvestmentById = `DELETE FROM
public.investments
WHERE id = $1
RETURNING id`;

/**
 * Deletes the tax for either an investment or dividend based on input variable
 * @param {'dividend' | 'investment'} id_type can delete either an investment or a dividend tax
 * @returns investment_id or dividend_id as id
 */
const deleteInvestmentTaxById = (id_type: 'investment' | 'dividend') => {
  return `DELETE FROM
  public.investment_taxes
  WHERE ${id_type === 'investment' ? 'investment_id' : 'dividend_id'} = $1
  RETURNING ${id_type === 'investment' ? 'investment_id' : 'dividend_id'} as id`;
};

/**
 * Deletes dividend from investment bridge by dividend id
 * from public.bridge_investment_dividends
 * @returns investment_id as id
 */
const deleteDividendFromBridgeById = `DELETE FROM
public.bridge_investment_dividends
WHERE dividend_id = $1
RETURNING investment_id as id`;

/**
 * Deletes dividend by id
 * from public.investment_dividends
 * @returns id
 */
const deleteDividendById = `DELETE FROM
public.investment_dividends
WHERE id = $1
RETURNING id`;

/**
 * Deletes single row by supplying dimension_key and discount_start_date (composite PK)
 * from public.food_price_discounts
 * @returns dimension_key as id
 */
const deleteFoodItemDiscountByIdAndStartDate = `DELETE FROM
public.food_price_discounts
WHERE food_prices_dimension_key = $1
  AND discount_start_date = $2
RETURNING food_prices_dimension_key as id`;

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
  logSqlStatement,
  insertIntoTestTable,
  insertIntoUserSettings,
  insertIntoFoodItemDiscount,
  insertNewFoodItemIntoFoodPrices,
  insertIntoInvestments,
  insertIntoInvestmentDividends,
  insertIntoInvestmentTaxes,
  insertIntoBridgeInvestmentDividends,
  deleteFoodItemById,
  deleteFoodItemDiscountByIdAndStartDate,
  deleteInvestmentById,
  deleteInvestmentTaxById,
  deleteDividendFromBridgeById,
  deleteDividendById
};
