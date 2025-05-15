import { Router } from 'express';
import convertReleaseYearToNumber from '../../../core/middlewares/ChangeReleaseYearTypeOnBody.js';
import checkID from '../../../core/middlewares/checkId.js';
import { deleteOtherArtists } from '../../../core/middlewares/deleteMiddlewares.js';
import Protect from '../../../core/middlewares/protection.js';
import { setMusicFilesOnBody } from '../../../core/middlewares/setFile.js';
import validate from '../../../core/middlewares/validate.js';
import { uploadMusicFiles } from '../../../core/utils/upload.js';
import MusicController from '../controllers/music.controller.js';
import Music from '../models/Music.js';
import {
  validateCreateMusic,
  validateUpdateMusic,
} from '../validators/music.validator.js';
import likeRouter from './like.routes.js';
import { IMusic } from '../types/Music.js';

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

router.get(
  '/stats',
  protect,
  restrictTo('admin', 'owner'),
  music.getMusicStats
);

router.param('id', checkID);

router.use('/:musicId/like', likeRouter);

router
  .route('/:id')
  .get(music.getDocumentById)
  .patch(
    protect,
    restrictTo('admin', 'owner'),
    uploadMusicFiles,
    setMusicFilesOnBody,
    convertReleaseYearToNumber,
    deleteOtherArtists<IMusic>(Music),
    validate(validateUpdateMusic),
    music.updateDocumentById
  )
  .delete(protect, restrictTo('admin', 'owner'), music.deleteDocumentById);

export default router;
