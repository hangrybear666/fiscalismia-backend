const exerciseRouter = require ('express').Router()
const {
  getExercises,
  postExercise,
  updateExercise,
  deleteExercise } = require('../controllers/exerciseController')

exerciseRouter.get('/', getExercises)

exerciseRouter.post('/', postExercise)

exerciseRouter.put('/:id', updateExercise)

exerciseRouter.delete('/:id', deleteExercise)

module.exports = exerciseRouter