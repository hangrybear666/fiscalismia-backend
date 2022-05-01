// Database Connection
const { Pool } = require('pg');
require('dotenv').config();

/**
 * When deployed DATABASE_URL is fetched from heroku config
 * When testing locally the database URL is constructed from environment variables pointing to a local windows installation
 */
const pool = !process.env.DATABASE_URL
// local
? new Pool({
  user: process.env.PG_USER,
  host: 'localhost',
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: process.env.PG_PORT,
  ssl: false
})
// deployed to heroku
: new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
})

module.exports = { pool }