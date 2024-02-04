// Database Connection
const { Pool } = pg = require('pg');
require('dotenv').config();

/**
 * node-postgres converts DATE and TIMESTAMP columns into the local time of the node process
 * and this node process is offset by 2 hours, resulting in a date 1 day before the db-date
 * this requires overriding the date-parsing mechanism of node and providing string values as output
 * The type id can be found in the file: node_modules/pg-types/lib/textParsers.js
 * See: https://node-postgres.com/features/types
 */
pg.types.setTypeParser(1114, function(stringValue) {
  return stringValue;  //1114 for time without timezone type
});
pg.types.setTypeParser(1082, function(stringValue) {
  return stringValue;  //1082 for date type
});
/**
 * PG Integers are 64bit(INT8), while javascript numbers are only 32bit(INT4), that's why node-postgres interprets numeric
 * datatypes as strings. If we can confidently assume that numbers in the database never exceed 32bit, we can override this type conversion.
 */
pg.types.setTypeParser(20, function(val) {
  return parseInt(val, 10) //20 for INT8
})
pg.types.setTypeParser(1700, function(val) {
  return parseInt(val, 10) //1700 for numeric
})
/**
 * When deployed DATABASE_URL is fetched from heroku config
 * When testing locally the database URL is constructed from environment variables pointing to a local windows installation
 */
const pool = !process.env.DB_CONNECTION_URL
// local db
? new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
  ssl: false
})
// deployed to heroku
: new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  ssl: {rejectUnauthorized: false}
})

module.exports = { pool }