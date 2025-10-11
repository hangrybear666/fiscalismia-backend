// Global Dependencies
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Routes
const unauthenticatedRoutes = require('./routes/unauthenticatedRoutes');
const publicSchemaRouter = require('./routes/publicSchemaRoutes');
const userSchemaRouter = require('./routes/userSchemaRoutes');
const multerRouter = require('./routes/multerRoutes');

// Local Dependencies
const config = require('./utils/config');
const errorHandler = require('./middleware/errorHandler');
const { authenticateUser } = require('./middleware/authentication');
const { addUserSchemaToSearchPath } = require('./middleware/userSchemaInit');
const logger = require('./utils/logger');

const app = express();

/**
 * Cross-origin resource sharing - access control from outide domains
 */
const isNonProd = process.env.NODE_ENV !== 'production';
const allowedOrigins = [
  'http://localhost:3001', // local frontend
  'http://localhost:3002', // local backend (persisted images)
  `https://www.${config.PUBLIC_DOMAIN}`,
  `https://www.demo.${config.PUBLIC_DOMAIN}`
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true); // Enforce allowlist and deny others
    } else if (!origin && isNonProd) {
      logger.warn('#####################');
      callback(null, true); // Allow no-origin for development and supertest
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS. Must be in allowedOrigins in backend.`));
    }
  },
  methods: 'GET,POST,PUT,DELETE', // Only allow these specific HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow required headers for JSON and authentication
  credentials: true, // Essential for allowing cookies/sessions to be sent and received
  maxAge: 3600 // 1 hour Pre-flight Cache for OPTIONS
};
app.use(cors(corsOptions));

/**
 * Helmet is a security middleware for setting HTTP Headers according to best practices
 * These limit the attack vector by e.g. enforcing TLS and preventing XSS
 * See: https://helmetjs.github.io/ https://github.com/helmetjs/helmet/blob/main/README.md
 */

/**
 * static is a middleware for returning files
 * allows express to serve static content such as webpages in .html format
 * http GET request to ROOT of URL will look in build folder for specified file
 * http GET request to ROOT of URL will serve index.html if no file specified
 * 404 otherwise
 */
// app.use(express.static('build'))

app.use(
  morgan(
    ':method request to ":url" with length [:req[content-length]] bytes and status [:status] from [:remote-addr] :remote-user - :response-time ms'
  )
);
/**
 * bodyParser enables reading data from HTTP POST requests such as:
 * text/plain via bodyParser.text() with a limit of 2MB
 * application/json via bodyParser.json() with a limit of 4MB
 */
app.use(bodyParser.text({ limit: '2097152' }));
app.use(bodyParser.json({ limit: '4194304' }));

/**
 * Add Express Router Endpoints for REST API Access
 */
app.use(config.API_ADDRESS, unauthenticatedRoutes);
app.use(config.API_ADDRESS, authenticateUser, publicSchemaRouter);
app.use(config.API_ADDRESS, authenticateUser, addUserSchemaToSearchPath, userSchemaRouter);
app.use(config.API_ADDRESS, authenticateUser, addUserSchemaToSearchPath, multerRouter);

/**
 * Adds custom Error handling
 */
app.use(errorHandler);

export { app, config };
