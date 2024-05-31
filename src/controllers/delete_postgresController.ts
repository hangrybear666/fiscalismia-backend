const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
import { Request, Response } from 'express';
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
  const sql = 'DELETE FROM test_table  WHERE id = $1 RETURNING description';
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
      error.message = `Transaction ROLLBACK. Row could not be deleted from test_table. ` + error.message;
    }
    throw error;
  } finally {
    client.release();
  }
});

/**
 * @description DELETE request to delete the row with dimension_key == :id from table_food_prices
 * @method HTTP DELETE
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/food_item/:id
 */
const deleteFoodItem = asyncHandler(async (request: Request, response: Response) => {
  logger.http('delete_postgresController received DELETE to /api/fiscalismia/food_item/' + request.params.id);
  const sql = 'DELETE FROM public.table_food_prices WHERE dimension_key = $1 RETURNING dimension_key as id';
  const parameters = [request.params.id];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(sql, parameters);
    await client.query('COMMIT');
    const results = { results: result ? result.rows : null };
    if (result?.rows?.length > 0) {
      response.status(200).send(results);
      logger.info('Successfully deleted food item with id: [' + result.rows[0].id + ']');
    } else {
      throw new Error('DELETE SQL has not returned the deleted id.');
    }
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    response.status(400);
    if (error instanceof Error) {
      error.message = `Transaction ROLLBACK. Row could not be deleted from test_table. ` + error.message;
    }
    throw error;
  } finally {
    client.release();
  }
});

module.exports = {
  deleteTestData,
  deleteFoodItem
};
