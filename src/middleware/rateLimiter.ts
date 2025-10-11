import { Request, Response } from 'express';

const rateLimit = require('express-rate-limit');

/**
 * A standard configuration to apply to all limiters to reduce code duplication.
 * It identifies users by their IP address.
 */
const standardOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429, // Too Many Requests
  validate: true, // Validates against common proxy misconfigurations. See https://express-rate-limit.mintlify.app/reference/configuration#validate
  ipv6Subnet: 64 // Blocks a range of /64 IPV6 addresses at once, since ISPs typically assign customers a range of IPV6 addresses.
};

/**
 * @description Limits login and user creation attempts to prevent brute-force attacks.
 */
const unauthenticatedRateLimiter = rateLimit({
  ...standardOptions,
  max: 10,
  message: 'Too many login or account creation attempts. Please try again in 15 minutes.'
});

/**
 * @description Global fallback that is triggered if no specific rate limiter is applied.
 */
const genericFallbackRateLimiter = rateLimit({
  ...standardOptions,
  max: 90,
  message: 'Exceeded generic rate limit. Try again after 15 minutes or contact your administrator to raise limit.'
});

/**
 * @description Limits image queries - since each image receives a GET request, this limit should be fairly high
 */
const imageRetrievalRateLimiter = rateLimit({
  ...standardOptions,
  max: 1800,
  message: 'Image retrieval rate exceeded. Try again in 15 minutes or ask your administrator to increase this limit.'
});

/**
 * @description A more lenient limiter for authenticated users.
 * This limiter is dynamic:
 * - For GET requests (reading data), it allows 300 requests per 15 minutes.
 * - For other methods (POST, PUT, DELETE), it allows 100 requests per 15 minutes.
 */
const authenticatedRateLimiter = rateLimit({
  ...standardOptions,
  max: (req: Request, _res: Response) => {
    if (req.method === 'GET') {
      return 450;
    }
    return 90;
  },
  message:
    'Authenticated route rate limit exceeded. Try again in 15 minutes or ask your administrator to increase this limit.'
});

module.exports = {
  unauthenticatedRateLimiter,
  imageRetrievalRateLimiter,
  genericFallbackRateLimiter,
  authenticatedRateLimiter
};
