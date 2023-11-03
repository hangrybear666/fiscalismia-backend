const multerRoutes = require ('express').Router()
const { authenticateUser } = require('../middleware/authentication.js')
const { postFoodItemImg } = require('../controllers/multerController')
const logger = require('../utils/logger')
var multer = require("multer")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/uploads/')
  },
  filename: function (req, file, cb) {
    const fileExtension = `.${file.mimetype.split('/')[1]}`
    cb(null, file.fieldname + '-' + Date.now() + fileExtension)
  }
})
const uploadFoodItemImg = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit of input type="file"
    fieldSize: 1 * 1024, // 1kb Limit of input type="text"
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/webp') {
     logger.error(`mimetype ${file.mimetype} does not conform to expected mimetypes.`)
     return cb(null, false, new multer.MulterError('Images must be uploaded as either png, jpeg or webp!'));
    }
    cb(null, true);
   }

})

/*     __   __   __  ___
 *    |__) /  \ /__`  |
 *    |    \__/ .__/  |
 */
multerRoutes.post('/upload/food_item_img', uploadFoodItemImg.single('foodItemImg'), postFoodItemImg)

module.exports = multerRoutes