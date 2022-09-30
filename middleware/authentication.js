const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { buildFindUserById } = require('../utils/SQL_UTILS')
require('dotenv').config()
const { pool } = require('../utils/pgDbService')

/**
 * Middleware for user authentication of protected routes
 * 1) reads the authorization header starting with String 'Bearer ' and extracts jsonwebtoken
 * 2) the jwt is then decoded with the same secret used for signing and the userId extracted
 * 3) the database is queried for this userId
 * 4) the request is assigned the variables userName and userId and next() called
 */
const authenticateUser = asyncHandler(async (request, response, next) => {
  logger.info("authentication.js received request to store jsonwebtoken")
  let token
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
    try {
      token = request.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
      const sql = buildFindUserById(decodedToken.userId)
      const parameters = ''
      const client = await pool.connect()
      const result = await client.query(sql, parameters)
      if (result.rowCount != 1) {
        logger.error('Authentication via token failed. SELECT to find user by id returns rowcount of ['.concat(result.rowCount).concat(']'))
        throw error
      }
      const results = { 'rows': (result) ? result.rows : null};
      if (results.rows[0].id
        && results.rows[0].id !== decodedToken.userId) {
        logger.error('Authentication via token failed. id from decoded token and database query do not match')
        throw error
      }
      request.userId = results.rows[0].id
      request.userName = results.rows[0].username
      logger.info('User ['.concat(request.userName).concat('] successfully authenticated with userId [').concat(request.userId).concat(']'))
      next()
    } catch (error) {
      response.status(401).send('User not authenticated with provided token.')
      throw error
    }
  }
  if (!token) {
    response.status(401).send('User not authenticated due to missing token.')
  }
})

module.exports = { authenticateUser }