// Global Dependencies
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

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
app.use(
  helmet({
    // Set 'Content-Security-Policy' to a custom value.
    contentSecurityPolicy: {
      directives: {
        // By default, allow loading resources from the same origin.
        defaultSrc: ['\'self\''],
        // Allow scripts from the same origin and inline scripts.
        scriptSrc: ['\'self\'', '\'unsafe-inline\''],
        // Allow styles from the same origin and inline styles.
        styleSrc: ['\'self\'', '\'unsafe-inline\''],
        // Allow images from the same origin, data uris and the backend-server
        imgSrc: ['\'self\'', 'data:'],
        // Allow fonts from the same origin.
        fontSrc: ['\'self\''],
        // Specify the valid sources for objects.
        objectSrc: ['\'none\''],
        // Instructs the browser to upgrade all insecure HTTP requests to HTTPS.
        upgradeInsecureRequests: []
      }
    },
    // Set 'Referrer-Policy' to a value that balances security and usability.
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Enable 'Strict-Transport-Security' (HSTS) to enforce HTTPS.
    hsts: {
      // Set the max-age to 1 year (a common recommendation).
      maxAge: 31536000,
      // Apply HSTS to all subdomains as well.
      includeSubDomains: true,
      // Preload HSTS in browsers.
      preload: true
    },
    // Set 'X-Content-Type-Options' to 'nosniff' to prevent MIME-sniffing.
    noSniff: true,
    // Set 'X-Frame-Options' to 'deny' to prevent clickjacking.
    frameguard: { action: 'deny' },
    // Hide the 'X-Powered-By' header to make it harder for attackers to identify the server technology.
    hidePoweredBy: true
  })
);

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
