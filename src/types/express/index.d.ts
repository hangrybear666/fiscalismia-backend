import express from 'express';

/**
 * adds 3 variables to the Request Object for user authentication via jwt auth.
 * These can be read from the frontend to protect routes.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: Record<number, any>;
      userName?: Record<string, any>;
      userEmail?: Record<string, any>;
    }
  }
}
