const logger = require("../utils/logger")

/**
 * @description
 * @param {*} error
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const errorHandler = (error, request, response, next) => {
  // if statusCode is preset, use that, otherwise 500
  const statusCode = response.statusCode ? response.statusCode : 500
  const errorPojo = {
    error : {
      name: error.name,
      severity: error.severity,
      code: error.code,
      routine: error.routine,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    },
  }
  // Error Logging to respective log file defined in ../utils/logger
  logger.error(`{name:"${errorPojo.error.name}"},{code:"${errorPojo.error.code}"},{routine:"${errorPojo.error.routine}"},{message:"${errorPojo.error.message}"}`)
  // Debug Logging to respective log file defined in ../utils/logger
  logger.debug(`${errorPojo.error.stack}`)

  // Fallback in case response hasn't been sent by respective method
  response
    .status(statusCode)
    .json(errorPojo)
  next(error)
}

module.exports = errorHandler