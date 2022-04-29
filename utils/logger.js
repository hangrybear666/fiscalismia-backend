const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
  format: winston.format.json(),
  // defaultMeta: { service: 'user-service' }, // define own metadata to be added
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}


module.exports = logger