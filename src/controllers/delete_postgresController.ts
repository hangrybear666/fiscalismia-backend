const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
import { Request, Response } from 'express';
const { deleteFoodItemById, deleteFoodItemDiscountByIdAndStartDate } = require('../utils/SQL_UTILS');
const { pool } = require('../utils/pgDbService');

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
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/:id
 */
const deleteTestData = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /api/fiscalismia/' + request.params.id);
  const sql = 'DELETE FROM test_table  WHERE id = $1 RETURNING id';
  const parameters = [request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    response.status(200).send(results);
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from test_table. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete 1-n rows with dimension_key == :dimension_key from public.table_food_prices
 * IS CASCADED TO DISCOUNTS VIA TRIGGER FUNCTION delete_food_item_discount_trigger_function()
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item/:dimension_key
 */
const deleteFoodItem = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'delete_postgresController received DELETE to /api/fiscalismia/food_item/' + request.params.dimension_key
  );
  const parameters = [request.params.dimension_key];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(deleteFoodItemById, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    if (result?.rows?.length > 0) {
      response.status(200).send(results);
      result.rows.forEach((e: any) => {
        logger.info('Successfully deleted food item with id: [' + e.id + ']');
      });
    } else {
      throw new Error('DELETE Food Item SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from public.table_food_prices. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete the row with supplied food_prices_dimension_key discount_start_date from public.food_price_discounts
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item_discount/:food_prices_dimension_key/:discount_start_date
 */
const deleteFoodItemDiscount = asyncHandler(async (request: Request, response: Response) => {
  logger.http(
    'delete_postgresController received DELETE to /api/fiscalismia/food_item_discount/' +
      request.params.food_prices_dimension_key +
      '/' +
      request.params.discount_start_date
  );
  const parameters = [request.params.food_prices_dimension_key, request.params.discount_start_date];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(deleteFoodItemDiscountByIdAndStartDate, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    if (result?.rows?.length > 0) {
      response.status(200).send(results);
      result.rows.forEach((e: any) => {
        logger.info('Successfully deleted food item discount with id: [' + e.id + ']');
      });
    } else {
      throw new Error('DELETE Food Item Discount SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from public.food_price_discounts. ${error.message}`;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  deleteTestData,
  deleteFoodItem,
  deleteFoodItemDiscount
};
