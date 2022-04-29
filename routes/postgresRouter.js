const postgresRouter = require ('express').Router()
const { getAll } = require('../controllers/postgresController')

postgresRouter.get('/', getAll)

module.exports = postgresRouter