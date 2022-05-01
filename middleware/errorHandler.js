const errorHandler = (error, request, response, next) => {

  // if statusCode is preset, use that, otherwise 500
  const statusCode = response.statusCode ? response.statusCode : 500
  response
    .status(statusCode)
    .json({
      name: error.name,
      severity: error.severity,
      code: error.code,
      routine: error.routine,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    })
  next(error)
}

module.exports = errorHandler