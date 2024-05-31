require('dotenv').config();

const PORT = process.env.PORT || 3004;
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.HOST_ADDRESS}:${PORT}${API_ADDRESS}`;
const ROOT_URL = `http://${process.env.HOST_ADDRESS}:${PORT}`;
const USERNAME_WHITELIST = process?.env?.USERNAME_WHITELIST?.split(',');

module.exports = {
  PORT,
  ROOT_URL,
  API_ADDRESS,
  SERVER_ADDRESS,
  USERNAME_WHITELIST
};
