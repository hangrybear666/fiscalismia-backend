const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')

/**
 * @description user uploading a single food item image to the server
 * <input type="file"/> in request.file with the following fields available:
 * - fieldname | originalname | encoding | mimetype | size | destination | path | buffer
 * <input type="text" name="example"/> in request.body.example
 * @type HTTP POST
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/upload/food_item_img
 */
const postFoodItemImg = asyncHandler(async  (request, response) => {
  logger.info("multerController received POST to /api/fiscalismia/upload/food_item_img")
  try {
    if (request.file?.path) {
      // Replaces backslash with forward slash
      const filePath = request.file.path.replace(/\\/g, '/')
      logger.info('file persisted in ' + filePath)
      response.status(200).send(filePath)
    }
    if (request.body?.imgMetaData) {
      logger.debug("Image Metadata received: " + request.body.imgMetaData)
    }
  } catch (error) {
    response.status(409)
    error.message = `Image upload to has encountered an error: \n ${error.message}`
    throw error
  }
})

module.exports = {
  postFoodItemImg,
}