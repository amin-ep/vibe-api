import { Router } from 'express';
import ProtectMiddlewares from '../../../core/middlewares/protection.js';
import CommentController from '../controllers/comment.controller.js';
import checkID from '../../../core/middlewares/checkId.js';
import validate from '../../../core/middlewares/validate.js';
import { validateCreateComment } from '../validators/comment.validator.js';
import setUserOnBody from '../../../core/middlewares/setUserOnBody.js';

const router = Router();

const { protect, restrictTo } = new ProtectMiddlewares();

const {
  createDocument,
  deleteDocumentById,
  getAllDocuments,
  getDocumentById,
  updateDocumentById,
  getPublishedComments,
  checkCommentTargetModel,
} = new CommentController();

router
  .route('/')
  .get(restrictTo('admin', 'owner'), getAllDocuments)
  .post(
    protect,
    setUserOnBody,
    checkCommentTargetModel,
    validate(validateCreateComment),
    createDocument
  );

router.get('/published', getPublishedComments);

router.param('id', checkID);

router
  .route('/:id')
  .get(getDocumentById)
  .patch(updateDocumentById)
  .delete(deleteDocumentById);

export default router;
