require('dotenv').config();

const PORT = process.env.PORT || 3004;
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.HOST_ADDRESS ? process.env.HOST_ADDRESS : 'localhost'}:${PORT}${API_ADDRESS}`;
const ROOT_URL = `http://${process.env.HOST_ADDRESS}:${PORT}`;

module.exports = {
  PORT,
  ROOT_URL,
  API_ADDRESS,
  SERVER_ADDRESS
};
