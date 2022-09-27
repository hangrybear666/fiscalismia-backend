// Global Dependencies
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const stringify = require('csv-stringify').stringify
const morgan = require('morgan')

// Routes
const postgresRouter = require('./routes/postgresRoutes')

// Local Dependencies
const config = require('./utils/config')
const errorHandler = require('./middleware/errorHandler')

// Constants
const PG_API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.PG_HOST}:${config.PORT}${PG_API_ADDRESS}`;

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
 */
 morgan.token('postBody', function getHeadr (req, res) { // eslint-disable-line
  return Object.keys(req.body).length === 0 ? null : JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

/**
 * bodyParser enables reading data from HTTP POST requests such as:
 * text/plain via bodyParser.text()
 * application/json via bodyParser.json()
 */
app.use(bodyParser.text())
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.json())

/**
 *
 */
app.use(PG_API_ADDRESS, postgresRouter)
app.use( errorHandler )

app.listen(config.PORT, () => console.log(`Server is running on address \r\n${SERVER_ADDRESS}`))