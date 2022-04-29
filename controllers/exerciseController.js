const exercises = require('../tempdel.json')
const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')

/**
 * @description queries entire generic exercise db containing approximately 1326 individual exercises
 * @type HTTP GET
 * @route /api/exercises
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const getExercises = asyncHandler(async (request, response) => {
  logger.info("controller received GET")
  response.status(200).json(exercises)
})

/**
 * @description adding entries to generic exercise db is not intended,
 * as user is missing the associated GIF files
 * @type HTTP POST
 * @route /api/exercises
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const postExercise = asyncHandler(async (request, response) => {
  logger.info("controller received POST")
  response.status(401)
  throw new Error('Adding exercises is not permitted' )
})

/**
 * @description receives request content replacing the content of an individual db entry
 * @type HTTP PUT
 * @route /api/exercises/:id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const updateExercise = asyncHandler(async (request, response) => {
  logger.info(`PUT req received for id ${request.params.id}`)
  response.status(200).json({ message: `PUT req received for id ${request.params.id}`})
})

/**
 * @description receives request to remove specific db entry
 * @type HTTP DELETE
 * @route /api/exercises/:id
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const deleteExercise = asyncHandler(async (request, response) => {
  logger.info(`DELETE req received for id ${request.params.id}`)
  response.status(200).json({ message: `DELETE req received for id ${request.params.id}` })
})

module.exports = {
  getExercises,
  postExercise,
  updateExercise,
  deleteExercise
}