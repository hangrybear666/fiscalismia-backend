require('dotenv').config()

const PORT = process.env.PORT || 3003
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.PG_HOST}:${PORT}${API_ADDRESS}`;
const USERNAME_WHITELIST = process.env.USERNAME_WHITELIST.split(',')

module.exports = {
  PORT,
  API_ADDRESS,
  SERVER_ADDRESS,
  USERNAME_WHITELIST
}