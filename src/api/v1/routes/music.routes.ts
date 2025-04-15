import { Router } from 'express';
import MusicController from '../controllers/music.controller.js';
import checkID from '../../../core/middlewares/checkId.js';
import Protect from '../../../core/middlewares/protection.js';
import { setMusicFilesOnBody } from '../../../core/middlewares/setFile.js';
import validate from '../../../core/middlewares/validate.js';
import {
  validateCreateMusic,
  validateUpdateMusic,
} from '../validators/music.validator.js';
import { uploadMusicFiles } from '../../../core/utils/upload.js';
import convertReleaseYearToNumber from '../../../core/middlewares/ChangeReleaseYearTypeOnBody.js';

const router = Router();

const music = new MusicController();
const { protect, restrictTo } = new Protect();

router
  .route('/')
  .get(music.getAllDocuments)
  .post(
    protect,
    restrictTo('admin', 'owner'),
    uploadMusicFiles,
    setMusicFilesOnBody,
    convertReleaseYearToNumber,
    validate(validateCreateMusic),
    music.createDocument
  );

router.param('id', checkID);

router
  .route('/:id')
  .get(music.getDocumentById)
  .patch(
    protect,
    restrictTo('admin', 'owner'),
    uploadMusicFiles,
    setMusicFilesOnBody,
    convertReleaseYearToNumber,
    validate(validateUpdateMusic),
    music.updateDocumentById
  )
  .delete(protect, restrictTo('admin', 'owner'), music.deleteDocumentById);

export default router;
