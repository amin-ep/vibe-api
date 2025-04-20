import { Router } from 'express';
import ArtistController from '../controllers/artist.controller.js';
import checkID from '../../../core/middlewares/checkId.js';
import Protect from '../../../core/middlewares/protection.js';
import validate from '../../../core/middlewares/validate.js';
import {
  validateCreateArtist,
  validateUpdateArtist,
} from '../validators/artist.validator.js';
import { setArtistImageOnBody } from '../../../core/middlewares/setFile.js';
import { uploadImageUrl } from '../../../core/utils/upload.js';
import albumRouter from './album.routes.js';

const router = Router();

const artist = new ArtistController();

const { protect, restrictTo } = new Protect();

router
  .route('/')
  .get(protect, restrictTo('admin', 'owner'), artist.getAllDocuments)
  .post(
    protect,
    restrictTo('admin', 'owner'),
    uploadImageUrl,
    setArtistImageOnBody,
    validate(validateCreateArtist),
    artist.createDocument
  );

router.param('id', checkID);
router.use('/:artistId/album', albumRouter);

router
  .route('/:id')
  .get(artist.getDocumentById)
  .patch(
    protect,
    restrictTo('admin', 'owner'),
    uploadImageUrl,
    setArtistImageOnBody,
    validate(validateUpdateArtist),
    artist.updateDocumentById
  )
  .delete(protect, restrictTo('admin', 'owner'), artist.deleteDocumentById);

export default router;
