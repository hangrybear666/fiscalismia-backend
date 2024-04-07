const logger = require('../utils/logger');
import { Request, Response } from 'express';
/**
 * @description
 * @param {*} error
 * @param {*} _request
 * @param {*} response
 * @param {*} next
 */
const errorHandler = (error: unknown, _request: Request, response: Response, next: any) => {
  // if statusCode is preset, use that, otherwise 500
  const statusCode = response?.statusCode != 200 ? response.statusCode : 500;
  const isErrorObject = error instanceof Error ? true : false;
  const errorPojo = {
    error: {
      name: isErrorObject ? (error as Error['name']) : null,
      message: isErrorObject ? (error as Error['message']) : null,
      stack: process.env.NODE_ENV === 'production' ? null : isErrorObject ? (error as Error['stack']) : null
    }
  };
  // Error Logging to respective log file defined in ../utils/logger
  logger.error(`{name:"${errorPojo.error.name}"},{message:"${errorPojo.error.message}"}`);
  // Debug Logging to respective log file defined in ../utils/logger
  logger.debug(`${errorPojo.error.stack}`);

  // Fallback in case response hasn't been sent by respective method
  response.status(statusCode).json(errorPojo);
  next(error);
};

module.exports = errorHandler;
