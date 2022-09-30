const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
require('dotenv').config()

/**
 * generates a token encrypted via secret key to store a users' id
 * @param {*} userId the id of a user extracted from the database
 * @returns the signed json web token with an expiration date
 */
const generateToken = (userId) => {
  logger.info("security.js received request to generate jsonwebtoken")
  const secret = process.env.JWT_SECRET
  const token = jwt.sign({ userId }, secret, {expiresIn : '1d'})
  return(token)
}

module.exports = { generateToken }