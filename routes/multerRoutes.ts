import { FileFilterCallback } from 'multer';
const { authenticateUser } = require('../middleware/authentication.ts');
const multerRoutes = require('express').Router();
const { postFoodItemImg, getFoodItemImg, deleteFoodItemImg } = require('../controllers/multerController');
const logger = require('../utils/logger');
var multer = require('multer');

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const storage = multer.diskStorage({
  destination: function (_req: Express.Request, _file: Express.Multer.File, cb: DestinationCallback) {
    cb(null, './public/img/uploads/');
  },
  filename: function (_req: Express.Request, file: Express.Multer.File, cb: FileNameCallback) {
    const fileExtension = `.${file.mimetype.split('/')[1]}`;
    cb(null, file.fieldname + '-' + Date.now() + fileExtension);
  }
});
const uploadFoodItemImg = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit of input type="file"
    fieldSize: 1 * 1024, // 1kb Limit of input type="text"
    files: 1
  },
  // I do not know how to send a response containing error information to the user so
  // this validation is thus repeated in the frontend
  fileFilter: function (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/webp') {
      logger.error(`mimetype ${file.mimetype} does not conform to expected mimetypes.`);
      return cb(null, false);
    }
    cb(null, true);
  }
});

/*     __   __   __  ___
 *    |__) /  \ /__`  |
 *    |    \__/ .__/  |
 */
multerRoutes.post('/upload/food_item_img', authenticateUser, uploadFoodItemImg.single('foodItemImg'), postFoodItemImg);

/*     __   ___ ___
 *    / _` |__   |
 *    \__> |___  |
 */
multerRoutes.get('/public/img/uploads/:filepath', getFoodItemImg);

/*     __   ___       ___ ___  ___
 *    |  \ |__  |    |__   |  |__
 *    |__/ |___ |___ |___  |  |___
 */
multerRoutes.delete('/public/img/uploads/:id', deleteFoodItemImg);

module.exports = multerRoutes;
