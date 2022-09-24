const logger = require("../utils/logger")

const errorHandler = (error, request, response, next) => {

  // if statusCode is preset, use that, otherwise 500
  const statusCode = response.statusCode ? response.statusCode : 500
  const errorPojo = {
    name: error.name,
    severity: error.severity,
    code: error.code,
    routine: error.routine,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  }
  response
    .status(statusCode)
    .json(errorPojo)
  logger.error(`{name:"${errorPojo.name}"},{code:"${errorPojo.code}"},{routine:"${errorPojo.routine}"},{message:"${errorPojo.message}"}`)
  logger.debug(`${errorPojo.stack}`)
  next(error)
}

module.exports = errorHandler