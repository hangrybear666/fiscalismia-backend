const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const format = require('pg-format');
const { pool } = require('../utils/pgDbService');
import { Request, Response } from 'express';
const {
  buildInsertUmUsers,
  buildVerifyUsername,
  buildInitializeUserSettings,
  logSqlStatement
} = require('../utils/SQL_UTILS');

const usernameRegExp = /^[a-zA-Z0-9_]{3,32}$/;
const regExAlphaNumeric = /^[a-zA-Z0-9._-]*$/;
const regExEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
  if (!usernameRegExp.test(credentials.username)) {
    logger.debug(`username ${credentials.username} fails regular expression test. ${usernameRegExp}`);
    response.status(422); // Unprocessable Content
    throw new Error(
      'username must conform to the latin alphabet! Allowed are 3-32 alphanumerical Chracters and underscores'
    );
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
  const client = await pool.connect();
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

const createUserCredentialsAndSchema = asyncHandler(async (request: Request, response: Response) => {
  const { username, email, password } = request.body;

  // 1. Basic validation
  if (!username || !email || !password) {
    return response.status(400).send('Username, email, and password are required.');
  }
  // Add more robust validation (e.g., password strength, valid email format)

  const schemaName = `private_${username.toLowerCase()}`;

  // Read SQL template files
  const ddlTemplate = fs.readFileSync(path.join(__dirname, '..', 'sql', 'ddl-template.sql'), 'utf8');
  const dmlTemplate = fs.readFileSync(path.join(__dirname, '..', 'sql', 'dml-template.sql'), 'utf8');

  const client = await pool.connect();

  try {
    // 2. Start Transaction
    await client.query('BEGIN');

    // 3. Create the user in the public table (using parameterized queries!)
    const userInsertQuery =
      'INSERT INTO public.um_users (username, email, password, schema) VALUES ($1, $2, crypt($3, gen_salt(\'bf\',12)), $4) RETURNING id;';
    const userResult = await client.query(userInsertQuery, [username, email, password, schemaName]);
    const userId = userResult.rows[0].id;

    // 4. Create the user-specific schema
    // Use pg-format to safely quote the schema name
    await client.query(format('CREATE SCHEMA %I', schemaName));

    // 5. Temporarily set the search_path for this transaction to the new schema
    await client.query(format('SET search_path TO %I, public', schemaName));

    // 6. Execute the DDL and DML scripts within the new schema
    await client.query(ddlTemplate);
    await client.query(dmlTemplate);

    // 7. Insert default user settings
    const settings = [
      { key: 'selected_mode', value: 'light' },
      { key: 'selected_palette', value: 'default' },
      { key: 'selected_language', value: 'en_US' }
    ];
    for (const setting of settings) {
      await client.query(
        'INSERT INTO public.um_user_settings (user_id, setting_key, setting_value) VALUES ($1, $2, $3)',
        [userId, setting.key, setting.value]
      );
    }

    // 8. Commit the transaction
    await client.query('COMMIT');

    response.status(201).send({ message: `User ${username} created successfully.` });
  } catch (error) {
    // 9. If any error occurs, roll back the transaction
    await client.query('ROLLBACK');
    logger.error('User creation failed:', error);
    response.status(500).send('Failed to create user.');
  } finally {
    // 10. Always release the client back to the pool
    client.release();
  }
});

module.exports = { createUserCredentials, createUserCredentialsAndSchema };
