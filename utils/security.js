const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
require('dotenv').config()

/**
 * generates a token encrypted via secret key to store a users' id
 * @param {*} user a user object containing userId, userName and userEmail extracted from the database table um_users
 * @returns the signed json web token with an expiration date
 */
const generateToken = (user) => {
  logger.info("security.js received request to generate jsonwebtoken")
  const secret = process.env.JWT_SECRET
  const token = jwt.sign({ user }, secret, {expiresIn : '1d'})
  return(token)
}

module.exports = { generateToken }