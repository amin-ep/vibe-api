import ProtectMiddlewares from '../../../core/middlewares/protection.js';
import express from 'express';
import LikeController from '../controllers/like.controller.js';
import setUserOnBody from '../../../core/middlewares/setUserOnBody.js';
import validate from '../../../core/middlewares/validate.js';
import { validateToggleLike } from '../validators/like.validators.js';

const router = express.Router({ mergeParams: true });

const { protect } = new ProtectMiddlewares();
const like = new LikeController();

router
  .route('/')
  .get(like.getAllDocuments)
  .post(
    protect,
    setUserOnBody,
    like.setMusicOnBody,
    validate(validateToggleLike),
    like.toggleLike
  );
router.route('/:id').get(like.getDocumentById);

export default router;
