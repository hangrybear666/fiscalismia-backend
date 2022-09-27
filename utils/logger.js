const { createLogger, format, transports } = require('winston');

/**
 * @description
 */
const logger = createLogger({
  level: 'info', // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
  format: format.combine(
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp ? info.timestamp.trim() : null} ${info.level}: ${info.message ? info.message.trim() : null}`)
  ),
  // defaultMeta: { service: 'user-service' }, // define own metadata to be added
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `debug` or less to `combined.log`
    //
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/debug.log', level: 'debug' })
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(info => `${info.level}: ${info.message ? info.message.trim() : null}`)
      )
  }));
}

module.exports = logger