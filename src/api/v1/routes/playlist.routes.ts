import { Router } from 'express';
import PlaylistController from '../controllers/playlist.controller.js';
import Protect from '../../../core/middlewares/protection.js';
import setUserOnBody from '../../../core/middlewares/setUserOnBody.js';
import validate from '../../../core/middlewares/validate.js';
import {
  validateCreatePlaylist,
  validateUpdatePlaylist,
} from '../validators/playlist.validators.js';

const router = Router();

const playlist = new PlaylistController();
const { protect, restrictTo } = new Protect();

router.use(protect);
router
  .route('/')
  .get(restrictTo('admin', 'owner'), playlist.getAllDocuments)
  .post(
    setUserOnBody,
    validate(validateCreatePlaylist),
    playlist.createDocument
  );

router.get('/myPlaylists', playlist.getMyPlaylists);

router.patch(
  '/addMusic/:listId',
  validate(validateUpdatePlaylist),
  playlist.addMusicToPlaylist
);
router.delete(
  '/deleteMusic/:listId',
  validate(validateUpdatePlaylist),
  playlist.deleteMusicFromPlaylist
);

router
  .route('/:id')
  .get(playlist.getDocumentById)
  .patch(validate(validateUpdatePlaylist), playlist.updateDocumentById)
  .delete(playlist.deleteDocumentById);

export default router;
