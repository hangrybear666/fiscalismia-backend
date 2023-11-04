const asyncHandler = require('express-async-handler')
const logger = require('../utils/logger')
const { pool } = require('../utils/pgDbService')
const config = require('../utils/config')
const path = require('path')
const { buildInsertFoodItemImgFilePath,
  logSqlStatement } = require('../utils/SQL_UTILS')

/**
 * @description user uploading a single food item image to the server
 * <input type="file" name="foodItemImg" /> in request.file with the following fields available:
 * - fieldname | originalname | encoding | mimetype | size | destination | path | buffer
 * <input type="text" name="imgMetaData" /> in request.body.imgMetaData
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
      const element = {
        id: request.body?.id,
        filepath: filePath
      }
      const sql = buildInsertFoodItemImgFilePath(element)
      const parameters = ''
      const client = await pool.connect()
      try {
        logSqlStatement(sql,parameters)
        const result = await client.query(sql, parameters)
        if (result.rowCount == 1) {
          logger.info(`file successfully persisted in db for food item with id [${element.id}] in filepath: ' ${element.filePath} `)
          response.status(200).send(filePath)
        } else {
          throw new Error()
        }
      } catch (error) {
        response.status(400)
        error.message = `INSERT of filepath into food_price_image_location failed. ` + error.message
        throw error
      } finally {
        client.release();
      }
    }
    if (request.body?.imgMetaData) {
      logger.debug("Image Metadata received: " + request.body.imgMetaData)
    }
  } catch (error) {
    response.status(409)
    error.message = `Image upload to /api/fiscalismia/upload/food_item_img has encountered an error: \n ${error.message}`
    throw error
  }
})

/**
 * @description fetching food item image from server's filesystem
 * @type HTTP GET
 * @async asyncHandler passes exceptions within routes to errorHandler middleware
 * @route /api/fiscalismia/public/img/uploads/:filepath
 */
const getFoodItemImg = asyncHandler(async (request, response, next) => {
  const filepath = request.params.filepath;
  logger.info(`read_postgresController received GET to /api/fiscalismia/public/img/uploads/${filepath}`)
  const options = {
    root: path.join(__dirname, '../', '/public/img/uploads/')
  }
  try {
    response.sendFile(filepath, options, function (err) {
      if (err) {
        next(err)
      }
    })
    response.status(200);
    logger.info(`File sent in response. Location: ${config.SERVER_ADDRESS}${filepath}`)
  } catch (error) {
    response.status(400)
    error.message = `GET request to fetch food item image has failed. \n ${error.message}`
    throw error
  }
})

module.exports = {
  postFoodItemImg,
  getFoodItemImg,
}