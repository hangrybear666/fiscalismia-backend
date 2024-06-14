import {
  FixedCosts,
  FixedIncome,
  FoodItem,
  InvestmentAndTaxes,
  StagingVariableBills,
  UserSettingObject
} from '../utils/customTypes';
import { Request, Response } from 'express';
const {
  replaceCommaAndParseFloat,
  extractResultHeaders,
  headersAsExpected,
  parseHeader
} = require('../utils/sharedFunctions');

const asyncHandler = require('express-async-handler');
const { parse } = require('csv-parse/sync');
const logger = require('../utils/logger');
const format = require('pg-format');
const { pool } = require('../utils/pgDbService');
const {
  buildInsertStagingVariableBills,
  buildInsertFixedCosts,
  buildInsertFixedIncome,
  buildInsertInvestments,
  buildInsertNewFoodItems,
  buildInsertUmUsers,
  buildVerifyUsername,
  buildInitializeUserSettings,
  logSqlStatement
} = require('../utils/SQL_UTILS');
const { generateToken } = require('../utils/security');
const regExAlphabeticHyphensDotsUnderscores = /^[A-Za-z_.-]*$/;
const regExAlphaNumeric = /^[a-zA-Z0-9._-]*$/;
const regExEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 *    ______ _____ _____ _____    ______ _____ _____ _   _ _____ _____ _____ _____
 *    | ___ \  _  /  ___|_   _|   | ___ \  ___|  _  | | | |  ___/  ___|_   _/  ___|
 *    | |_/ / | | \ `--.  | |     | |_/ / |__ | | | | | | | |__ \ `--.  | | \ `--.
 *    |  __/| | | |`--. \ | |     |    /|  __|| | | | | | |  __| `--. \ | |  `--. \
 *    | |   \ \_/ /\__/ / | |     | |\ \| |___\ \/' / |_| | |___/\__/ / | | /\__/ /
 *    \_|    \___/\____/  \_/     \_| \_\____/ \_/\_\\___/\____/\____/  \_/ \____/
 */

/**
 * @description test query posting data into test_table
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/
 */
const postTestData = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/');
  const sql = 'INSERT INTO test_table(description) VALUES($1) RETURNING id';
  const parameters = [request.body.description];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description user settings for UPSERT statement of public.um_user_settings
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/settings
 */
const postUpdatedUserSettings = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/upload/um/settings');
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
  RETURNING (SELECT username FROM public.um_users WHERE id = (SELECT id FROM public.um_users WHERE username = $1))`;
  const userSettingObj: UserSettingObject = request.body;
  const parameters = [userSettingObj.username, userSettingObj.settingKey, userSettingObj.settingValue];
  if (!regExAlphabeticHyphensDotsUnderscores.test(userSettingObj.username)) {
    logger.debug(
      `username ${userSettingObj.username} did not match latin alphabet regex pattern ${regExAlphabeticHyphensDotsUnderscores}`
    );
    response.status(422); // Unprocessable Content
    throw new Error('username must conform to the latin alphabet!');
  }
  if (
    userSettingObj.settingKey === 'selected_mode' ||
    userSettingObj.settingKey === 'selected_language' ||
    userSettingObj.settingKey === 'selected_palette'
  ) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      logSqlStatement(sql, parameters);
      const result = await client.query(sql, parameters);
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      response.status(400);
      if (error instanceof Error) {
        error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
      }
      throw error;
    } finally {
      client.release();
    }
  } else {
    logger.debug(`${userSettingObj.settingKey} not in predefined list of expected values`);
    response.status(400);
    throw new Error('setting key is not valid. please refrain from posting it again.');
  }
});

/**
 * @description food item discount information object validated and added via frontend
 * contains the following fields:
 * id | price | startDate | endDate
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item_discount
 */
const postFoodItemDiscount = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/food_item_discount');
  const sql =
    'INSERT INTO public.food_price_discounts(food_prices_dimension_key, discount_price, discount_start_date, discount_end_date) VALUES($1,$2,$3,$4) RETURNING food_prices_dimension_key';
  const discountInfo = request.body;
  const parameters = [discountInfo.id, discountInfo.price, discountInfo.startDate, discountInfo.endDate];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description food item information object validated and added via frontend
 * contains the following fields:
 * food_item | brand | store | main_macro | kcal_amount | weight | price | last_update
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item
 */
const postNewFoodItem = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/food_item');
  const sql = `INSERT INTO public.table_food_prices(dimension_key, food_item, brand, store, main_macro, kcal_amount, weight, price, last_update, effective_date, expiration_date) VALUES (
      nextval('table_food_prices_seq'),
      $1, $2, $3, $4, $5, $6, $7, $8,
      current_date,
      to_date('01.01.4000','DD.MM.YYYY')
    ) RETURNING dimension_key as id`;
  const newFoodItem = request.body;
  const parameters = [
    newFoodItem.food_item,
    newFoodItem.brand,
    newFoodItem.store,
    newFoodItem.main_macro,
    newFoodItem.kcal_amount,
    newFoodItem.weight,
    newFoodItem.price,
    newFoodItem.last_update
  ];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(201).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description INSERTING investment and taxes information object validated and added via frontend
 * contains the following fields:
 * execution_type, description, isin, investment_type, marketplace, units, price_per_unit, total_price, fees, execution_date, pct_of_profit_taxed, profit_amt
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investments
 */
const postInvestmentAndTaxes = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/investments');
  const sqlInvestments = `INSERT INTO public.investments (execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date)
  VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING id`;
  const sqlTaxes = `INSERT INTO public.investment_taxes (investment_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
  VALUES (
      $1, $2, $3, $4, $5
    ) RETURNING investment_id as id`;
  const investmentAndTaxesObject = request.body;
  const parametersInvestments = [
    investmentAndTaxesObject.execution_type,
    investmentAndTaxesObject.description,
    investmentAndTaxesObject.isin,
    investmentAndTaxesObject.investment_type,
    investmentAndTaxesObject.marketplace,
    investmentAndTaxesObject.units,
    investmentAndTaxesObject.price_per_unit,
    investmentAndTaxesObject.total_price,
    investmentAndTaxesObject.fees,
    investmentAndTaxesObject.execution_date
  ];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    logSqlStatement(sqlInvestments, parametersInvestments);
    const result = await client.query(sqlInvestments, parametersInvestments);
    if (investmentAndTaxesObject.execution_type === 'sell' && result?.rows[0]?.id && result.rows[0].id > 0) {
      if (investmentAndTaxesObject.pct_of_profit_taxed === null || investmentAndTaxesObject.profit_amt === null) {
        const errorMessage = 'For Investment Sales pct_of_profit_taxed & profit_amt columns have to be defined';
        throw new Error(errorMessage);
      }
      const parametersTaxes =
        investmentAndTaxesObject.execution_type === 'sell'
          ? [
              result.rows[0].id,
              investmentAndTaxesObject.pct_of_profit_taxed,
              investmentAndTaxesObject.profit_amt,
              (
                ((Number(investmentAndTaxesObject.profit_amt) * Number(investmentAndTaxesObject.pct_of_profit_taxed)) /
                  100) *
                Number(0.26375)
              ).toFixed(2),
              new Date(investmentAndTaxesObject.execution_date).getFullYear()
            ]
          : null;
      // INVESTMENT IS A SALE (with Tax Information) && INSERT INVESTMENTS RETURNED SUCCESSFULLY
      logSqlStatement(sqlTaxes, parametersTaxes);
      const taxesResult = await client.query(sqlTaxes, parametersTaxes);
      await client.query('COMMIT');
      const results = {
        results: result ? result.rows : null,
        taxesResults: taxesResult ? taxesResult.rows : null
      };
      response.status(201).send(results);
    } else {
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description INSERTING dividends and taxes information object validated and added via frontend
 * contains the following fields:
 * isin, dividendAmount, dividendDate, pctOfProfitTaxed, profitAmount
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/investment_dividends
 */
const postDividendsAndTaxes = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/investment_dividends');
  const sqlDividends = `INSERT INTO public.investment_dividends (isin, dividend_amount, dividend_date)
  VALUES(
      $1, $2, $3
    ) RETURNING id`;
  const sqlTaxes = `INSERT INTO public.investment_taxes (dividend_id, pct_of_profit_taxed, profit_amt, tax_paid, tax_year)
  VALUES (
      $1, $2, $3, $4, $5
    ) RETURNING dividend_id as id`;
  const sqlBridgeInvestmentDividends = `INSERT INTO public.bridge_investment_dividends (investment_id, dividend_id, remaining_units)
  VALUES %L RETURNING investment_id as id, remaining_units`; // using pg-format for bulk insertion
  const dividendObject = request.body;
  const parametersDividends = [dividendObject.isin, dividendObject.dividendAmount, dividendObject.dividendDate];
  let parametersTaxes;
  let parametersBridge: any[][];

  if (!dividendObject.investmentIdsAndRemainingUnits || dividendObject.investmentIdsAndRemainingUnits.length === 0) {
    // Dividend is related to 1-n investments which are either fully or partially owned
    throw new Error('Dividend could not be associated with any owned investments. INSERT denied.');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    //   __            __   ___       __     ___       __        ___
    //  |  \ | \  / | |  \ |__  |\ | |  \     |   /\  |__) |    |__
    //  |__/ |  \/  | |__/ |___ | \| |__/     |  /~~\ |__) |___ |___
    logSqlStatement(sqlDividends, parametersDividends);
    const result = await client.query(sqlDividends, parametersDividends);
    // INVESTMENT IS A SALE (with Tax Information) && INSERT INVESTMENTS RETURNED SUCCESSFULLY
    if (result?.rows[0]?.id && result.rows[0].id > 0) {
      // ___           ___  __     ___       __        ___
      //  |   /\  \_/ |__  /__`     |   /\  |__) |    |__
      //  |  /~~\ / \ |___ .__/     |  /~~\ |__) |___ |___
      parametersTaxes = [
        result.rows[0].id,
        dividendObject.pctOfProfitTaxed,
        dividendObject.profitAmount,
        (
          ((Number(dividendObject.profitAmount) * Number(dividendObject.pctOfProfitTaxed)) / 100) *
          Number(0.26375)
        ).toFixed(2),
        new Date(dividendObject.executionDate).getFullYear()
      ];
      logSqlStatement(sqlTaxes, parametersTaxes);
      const taxesResult = await client.query(sqlTaxes, parametersTaxes);
      //   __            __   ___       __      __   __     __   __   ___
      //  |  \ | \  / | |  \ |__  |\ | |  \    |__) |__) | |  \ / _` |__
      //  |__/ |  \/  | |__/ |___ | \| |__/    |__) |  \ | |__/ \__> |___
      let bridgeResult: any;
      parametersBridge = [];
      dividendObject.investmentIdsAndRemainingUnits.forEach((e: { investmentId: number; remainingUnits: number }) => {
        parametersBridge.push([e.investmentId, result.rows[0].id, e.remainingUnits]);
      });
      try {
        /**
         * pg-format takes a value array and constructs multiple insert statements to be executed in one transaction.
         * syntax: format('INSERT INTO test_table (id, name) VALUES %L', valueArray)
         */
        const promiseResult = await new Promise((resolve, reject) => {
          client.query(format(sqlBridgeInvestmentDividends, parametersBridge), [], (error: unknown, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
        bridgeResult = promiseResult;
      } catch (error: unknown) {
        const errorMessage = `INSERT INTO public.bridge_investment_dividends has encountered an error: ${(error as Error).message}`;
        throw new Error(errorMessage);
      }
      await client.query('COMMIT');
      const results = {
        results: result ? result.rows : null,
        taxesResults: taxesResult ? taxesResult.rows : null,
        bridgeResults: bridgeResult ? bridgeResult.rows : null
      };
      response.status(201).send(results);
    } else {
      await client.query('COMMIT');
      const results = { results: result ? result.rows : null };
      response.status(201).send(results);
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. data could not be inserted. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/** _____ _____  _   _      _____ _   _  _____ ___________ _____ _____
 * |_   _/  ___|| | | |    |_   _| \ | |/  ___|  ___| ___ \_   _/  ___|
 *   | | \ `--. | | | |      | | |  \| |\ `--.| |__ | |_/ / | | \ `--.
 *   | |  `--. \| | | |      | | | . ` | `--. \  __||    /  | |  `--. \
 *   | | /\__/ /\ \_/ /     _| |_| |\  |/\__/ / |___| |\ \  | | /\__/ /
 *   \_/ \____/  \___/      \___/\_| \_/\____/\____/\_| \_| \_/ \____/
 */

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description,  category,  store, cost,  purchasing_date,  is_planned,  contains_indulgence, sensitivities
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/variable_expenses
 */
const postVariableExpensesTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/variable_expenses');
  try {
    const expectedColumns = [
      'description',
      'category',
      'store',
      'cost',
      'purchasing_date',
      'is_planned',
      'contains_indulgence',
      'sensitivities'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'cost') {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: StagingVariableBills) => {
      const insertRow = buildInsertStagingVariableBills(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_costs
 * @returns INSERT INTO statements in response
 */
const postFixedCostsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/fixed_costs');
  try {
    const expectedColumns = [
      'category',
      'description',
      'monthly_interval',
      'billed_cost',
      'monthly_cost',
      'effective_date',
      'expiration_date'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (
          context.column === 'monthly_interval' ||
          context.column === 'billed_cost' ||
          context.column === 'monthly_cost'
        ) {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FixedCosts) => {
      const insertRow = buildInsertFixedCosts(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * description,	type,	monthly_interval,	value,	effective_date,	expiration_date
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/fixed_income
 * @returns INSERT INTO statements in response
 */
const postIncomeTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/fixed_income');
  try {
    const expectedColumns = ['description', 'type', 'monthly_interval', 'value', 'effective_date', 'expiration_date'];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'monthly_interval' || context.column === 'value') {
          return replaceCommaAndParseFloat(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FixedIncome) => {
      const insertRow = buildInsertFixedIncome(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * IF EXECUTION_TYPE IS SELL IT EXPECTS 2 MORE COLUMNS TO BE FILLED AND WILL GENERATE ANOTHER INSERT INTO STATEMENT FOR public.investment_taxes
 * MANDATORY HEADER STRUCTURE:
 * execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date, pct_of_profit_taxed, profit_amt
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/investments
 * @returns INSERT INTO statements in response
 */
const postInvestmentsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/investments');
  try {
    const expectedColumns = [
      'execution_type',
      'description',
      'isin',
      'investment_type',
      'marketplace',
      'units',
      'price_per_unit',
      'total_price',
      'fees',
      'execution_date',
      'pct_of_profit_taxed',
      'profit_amt'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (
          context.column === 'price_per_unit' ||
          context.column === 'total_price' ||
          context.column === 'fees' ||
          context.column === 'profit_amt' ||
          context.column === 'pct_of_profit_taxed'
        ) {
          return replaceCommaAndParseFloat(value);
        } else if (context.column === 'units') {
          return parseInt(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: InvestmentAndTaxes) => {
      const insertRow = buildInsertInvestments(e);
      insertStatements = insertStatements.concat(insertRow);
      if (e.execution_type === 'sell') {
        if (e.pct_of_profit_taxed === null || e.profit_amt === null) {
          const errorMessage = 'For Investment Sales pct_of_profit_taxed & profit_amt columns have to be defined';
          throw new Error(errorMessage);
        }
        // CREATES 2 INSERT INTO STATEMENTS FOR SALES TO CONSIDER TAXES
        insertCount += 2;
      } else {
        insertCount++;
      }
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/**
 * @description receives tab-separated value as text in the http post body to transform into insert queries for ETL
 * MANDATORY HEADER STRUCTURE:
 * food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/texttsv/new_food_items
 * @returns INSERT INTO statements in response
 */
const postNewFoodItemsTextTsv = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/texttsv/new_food_items');
  try {
    const expectedColumns = [
      'food_item',
      'brand',
      'store',
      'main_macro',
      'kcal_amount',
      'weight',
      'price',
      'last_update'
    ];
    const result = parse(request.body, {
      columns: expectedColumns,
      from_line: 2, // skip first line, as headers are provided
      cast: (value: any, context: any) => {
        if (context.column === 'price') {
          return replaceCommaAndParseFloat(value);
        } else if (context.column === 'kcal_amount' || context.column === 'weight') {
          return parseInt(value);
        } else {
          return String(value);
        }
      },
      delimiter: '\t',
      trim: true,
      skip_empty_lines: true
    });
    const providedColumnResult = parseHeader(request.body);
    const resultColumns = extractResultHeaders(providedColumnResult);
    headersAsExpected(resultColumns, expectedColumns);
    let insertStatements = '';
    let insertCount = 0;
    result.forEach((e: FoodItem) => {
      const insertRow = buildInsertNewFoodItems(e);
      insertStatements = insertStatements.concat(insertRow);
      insertCount++;
    });
    const resultMessage = `--[${request.body ? result.length : 0}] rows transformed into [${insertCount}] INSERT STATEMENTS\n`;
    insertStatements = resultMessage + insertStatements + resultMessage;
    logger.debug(
      `received tsv-data from body with [${request.body ? result.length : 0}] rows and transformed into [${insertCount}] INSERT STATEMENTS`
    );
    response.status(200).send(insertStatements);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `The provided text/plain data could not be converted into INSERT Statements. ${error.message}`;
    }
    throw error;
  }
});

/** _____ ______ ___________ _____ _   _ _____ _____  ___   _      _____
 * /  __ \| ___ \  ___|  _  \  ___| \ | |_   _|_   _|/ _ \ | |    /  ___|
 * | /  \/| |_/ / |__ | | | | |__ |  \| | | |   | | / /_\ \| |    \ `--.
 * | |    |    /|  __|| | | |  __|| . ` | | |   | | |  _  || |     `--. \
 * | \__/\| |\ \| |___| |/ /| |___| |\  | | |  _| |_| | | || |____/\__/ /
 *  \____/\_| \_\____/|___/ \____/\_| \_/ \_/  \___/\_| |_/\_____/\____/
 */

/**
 * @description expects a application/json request.body containing username and password keys
 * destined for INSERTION into encrypted credential storage within database
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/credentials
 */
const createUserCredentials = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/um/credentials');
  const credentials = {
    username: request.body.username,
    email: request.body.email,
    password: request.body.password
  };
  if (!credentials.username || !credentials.password || !credentials.email) {
    logger.debug('username, email or password not provided in request.body');
    response.status(400); // Bad Request
    throw new Error('username, email and/or password missing in POST request');
  }
  if (!regExAlphabeticHyphensDotsUnderscores.test(credentials.username)) {
    logger.debug(`username did not match latin alphabet regex pattern ${regExAlphabeticHyphensDotsUnderscores}`);
    response.status(422); // Unprocessable Content
    throw new Error('username must conform to the latin alphabet!');
  }
  if (!regExEmail.test(credentials.email)) {
    logger.debug(`email did not match the chromium email regex pattern ${regExEmail}`);
    response.status(422); // Unprocessable Content
    throw new Error('email must conform to the Chromium email standard such as example_1@domain.xyz!');
  }
  if (!regExAlphaNumeric.test(credentials.password)) {
    logger.debug(`password did not match the alphanumeric regex pattern ${regExAlphaNumeric}`);
    response.status(422); // Unprocessable Content
    throw new Error('password must contain alphanumeric characters, hyphens or underscores only!');
  }
  let usernameWhitelist: string[] = [];
  const client = await pool.connect();
  try {
    const whitelistResult = await client.query('SELECT username from public.username_whitelist');
    usernameWhitelist = whitelistResult.rows.map((e: any) => e.username);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `Username whitelist could not be queried. ${error.message}`;
    }
    throw error;
  }
  if (!usernameWhitelist.includes(credentials.username)) {
    logger.debug(`username ${credentials.username} is not whitelisted!
    whitelist is as follows:
    ${usernameWhitelist}`);
    response.status(403); // Forbidden
    throw new Error('username not whitelisted. Please contact your administrator to gain access.');
  }
  const sqlInsertCredentials = buildInsertUmUsers(credentials);
  const sqlVerifyCredentials = buildVerifyUsername(credentials);
  const sqlInsertSettingsForNewUser = buildInitializeUserSettings(credentials);
  const parameters = '';
  try {
    await client.query('BEGIN');
    logSqlStatement(sqlInsertCredentials, parameters);
    await client.query(sqlInsertCredentials, parameters);
    logSqlStatement(sqlVerifyCredentials, parameters);
    const result = await client.query(sqlVerifyCredentials, parameters);
    const results = { results: result ? result.rows : null };
    if (result.rowCount != 1) {
      throw new Error('user could not be uniquely identified');
    }
    if (result?.rows[0]?.username !== credentials.username) {
      throw new Error('username provided does not match username in database');
    }
    await client.query(sqlInsertSettingsForNewUser, parameters);
    logSqlStatement(sqlInsertSettingsForNewUser, parameters);
    await client.query('COMMIT');
    response.status(201).send(results);
    logger.info('User ' + credentials.username + ' successfully created');
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK: user credentials could not be stored in the database. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description expects a application/json request.body containing username and password keys
 * @method HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/um/login
 */
const loginWithUserCredentials = asyncHandler(async (request: Request, response: Response) => {
  logger.http('create_postgresController received POST to /api/fiscalismia/um/login');
  const credentials = {
    username: request.body.username,
    password: request.body.password
  };
  if (!credentials.username || !credentials.password) {
    response.status(400);
    throw new Error('username and/or password not provided in request.body');
  }
  const sql = buildVerifyUsername(credentials);
  const parameters = '';
  const client = await pool.connect();
  try {
    logSqlStatement(sql, parameters);
    const result = await client.query(sql, parameters);
    if (result.rowCount != 1) {
      response.status(400);
      throw new Error(`Login failed. SELECT to verify user credentials returns rowcount of [${result.rowCount}]`);
    }
    const results = { rows: result ? result.rows : null };
    if (results.rows[0]?.username && results.rows[0]?.username !== credentials.username) {
      response.status(400);
      throw new Error('Login failed. username from request.body and database query do not match');
    }
    const user = {
      userId: results.rows[0]?.userid,
      userName: results.rows[0]?.username,
      userEmail: results.rows[0]?.useremail
    };
    const jwtToken = generateToken(user);
    response.status(200).send(jwtToken);
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      error.message = `Login failed. User could not be verified. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  postTestData,

  postFoodItemDiscount,
  postNewFoodItem,
  postInvestmentAndTaxes,
  postDividendsAndTaxes,

  postNewFoodItemsTextTsv,
  postInvestmentsTextTsv,
  postVariableExpensesTextTsv,
  postFixedCostsTextTsv,
  postIncomeTextTsv,

  createUserCredentials,
  loginWithUserCredentials,
  postUpdatedUserSettings
};
