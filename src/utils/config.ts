require('dotenv').config();

const BACKEND_PORT = process.env.BACKEND_PORT || 3004;
const API_ADDRESS = '/api/fiscalismia';
const SERVER_ADDRESS = `http://${process.env.HOST_ADDRESS ? process.env.HOST_ADDRESS : 'localhost'}:${BACKEND_PORT}${API_ADDRESS}`;
const ROOT_URL = `http://${process.env.HOST_ADDRESS}:${BACKEND_PORT}`;

module.exports = {
  BACKEND_PORT,
  ROOT_URL,
  API_ADDRESS,
  SERVER_ADDRESS
};
