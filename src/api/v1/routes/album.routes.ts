import { Router } from 'express';
import AlbumController from '../controllers/album.controller.js';
import Protect from '../../../core/middlewares/protection.js';
import validate from '../../../core/middlewares/validate.js';
import {
  validateCreateAlbum,
  validateUpdateAlbum,
} from '../validators/album.validators.js';
import ChangeReleaseYearTypeOnBody from '../../../core/middlewares/ChangeReleaseYearTypeOnBody.js';
import { uploadAlbumCoverImage } from '../../../core/utils/upload.js';
import { setAlbumCoverImageUrlOnBody } from '../../../core/middlewares/setFile.js';
import likeRouter from './like.routes.js';
import checkID from '../../../core/middlewares/checkId.js';

const router = Router({ mergeParams: true });

const album = new AlbumController();

const { protect, restrictTo } = new Protect();

router
  .route('/')
  .get(album.getAllDocuments)
  .post(
    protect,
    restrictTo('owner', 'admin'),
    uploadAlbumCoverImage,
    setAlbumCoverImageUrlOnBody,
    ChangeReleaseYearTypeOnBody,
    validate(validateCreateAlbum),
    album.createDocument
  );

router.param('id', checkID);

router.use('/:albumId/like', likeRouter);

router
  .route('/:id')
  .get(album.getDocumentById)
  .patch(
    protect,
    restrictTo('owner', 'admin'),
    uploadAlbumCoverImage,
    setAlbumCoverImageUrlOnBody,
    ChangeReleaseYearTypeOnBody,
    validate(validateUpdateAlbum),
    album.updateDocumentById
  )
  .delete(protect, restrictTo('owner', 'admin'), album.deleteDocumentById);

export default router;
