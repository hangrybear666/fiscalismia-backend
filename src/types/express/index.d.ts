import _express from 'express';

/**
 * adds custom variables to the Express Request Object for user authentication via jwt auth.
 * These can be encoded into the jwt token and extracted to protect routes
 * The userSchema can be used to separate user's data fully within the database.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: Record<number, any>;
      userName?: Record<string, any>;
      userEmail?: Record<string, any>;
      userSchema?: Record<string, any>;
    }
  }
}
