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
const createUserCredentialsAndSchema = asyncHandler(async (request: Request, response: Response) => {
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
  const ddlFileContent = fs.readFileSync(path.join(__dirname, '../../database/pgsql-ddl.sql'), 'utf8');
  // const dmlTemplate = fs.readFileSync(path.join(__dirname, '../../database/pgsql-dml.sql'), 'utf8');
  const parameters = '';
  try {
    await client.query('BEGIN');
    logSqlStatement(sqlInsertCredentials, parameters);
    await client.query(sqlInsertCredentials, parameters);
    logSqlStatement(sqlInsertSettingsForNewUser, parameters);
    await client.query(sqlInsertSettingsForNewUser, parameters);
    logSqlStatement(sqlVerifyCredentials, parameters);
    const result = await client.query(sqlVerifyCredentials, parameters);
    const results = { results: result ? result.rows : null };
    const userSchema = result?.rows[0]?.userschema;
    const userName = result?.rows[0]?.username;
    if (result.rowCount != 1) {
      throw new Error('user could not be uniquely identified');
    }
    if (!userName || userName !== credentials.username) {
      throw new Error('username provided does not match username in database');
    }
    if (!userSchema || userSchema !== `private_${credentials.username.toLowerCase()}`) {
      throw new Error(`userschema does not match private_${credentials.username.toLowerCase()} in database`);
    }
    // CREATE USER SCHEMA
    await client.query(format('CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION fiscalismia_api', userSchema));
    await client.query(format('GRANT ALL ON SCHEMA %I TO fiscalismia_api', userSchema));
    await client.query(format('SET search_path TO %I ', userSchema));
    logger.info(`User Schema ${userSchema} created and set as search_path for user [${userName}]`);

    // Sanitize the DDL script by removing any psql meta-commands:
    // (lines starting with '\' required by psql commands calling the script)
    const ddlTemplate = ddlFileContent
      .split('\n')
      .filter((line: string) => !line.trim().startsWith('\\'))
      .join('\n');
    // EXECUTE DDL STATEMENTS TO INIT DB
    await client.query(ddlTemplate);
    // if (process.env.NODE_ENV !== 'production') {
    //   // INIT WITH DEMO DATA FOR NONPROD
    //   await client.query(dmlTemplate);
    // }
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

module.exports = { createUserCredentialsAndSchema };
