// Global Dependencies
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ip = require('ip');

// Routes
const postgresRouter = require('./routes/postgresRoutes')
const multerRouter = require('./routes/multerRoutes')

// Local Dependencies
const config = require('./utils/config')
const errorHandler = require('./middleware/errorHandler')

const app = express()

/**
 * Cross-origin resource sharing - access control from outide domains
 */
app.use(cors())

/**
 * static is a middleware for returning files
 * allows express to serve static content such as webpages in .html format
 * http GET request to ROOT of URL will look in build folder for specified file
 * http GET request to ROOT of URL will serve index.html if no file specified
 * 404 otherwise
 */
// app.use(express.static('build'))

/**
 * morgan REST logging middleware
 * the custom token adds logging of added objects for
 * POST requests and PUT requests, otherwise adds null
 * to Display the Body add :postBody
 * TODO log to somewhere else than console once deployed
*/
morgan.token('postBody', function getHeadr (req, res) { // eslint-disable-line
  return Object.keys(req.body).length === 0 ? null : JSON.stringify(req.body)
})

app.use(morgan(':method request to ":url" with length [:req[content-length]] bytes and status [:status] from [:remote-addr] :remote-user - :response-time ms'))
/**
 * bodyParser enables reading data from HTTP POST requests such as:
 * text/plain via bodyParser.text() with a limit of 2MB
 * application/json via bodyParser.json() with a limit of 4MB
 */
app.use(bodyParser.text({limit: '2097152'}))
app.use(bodyParser.json({limit: '4194304'}))

/**
 *
 */
app.use(config.API_ADDRESS, postgresRouter)
app.use(config.API_ADDRESS, multerRouter)
app.use( errorHandler )

module.exports = app;