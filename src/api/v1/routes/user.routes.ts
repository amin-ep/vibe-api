import { Router } from 'express';
import Protect from '../../../core/middlewares/protection.js';
import UserController from '../controllers/user.controller.js';
import checkID from '../../../core/middlewares/checkId.js';

const router = Router();

const { protect, restrictTo, protectUser } = new Protect();
const user = new UserController();

router.use(protect);

router
  .route('/')
  .post(restrictTo('owner'), user.createDocument)
  .get(restrictTo('admin', 'owner'), user.getAllDocuments);

router.param('id', checkID);

router
  .route('/:id')
  .get(restrictTo('admin', 'owner'), user.getDocumentById)
  .patch(restrictTo('admin', 'owner'), protectUser, user.updateDocumentById)
  .delete(restrictTo('admin', 'owner'), protectUser, user.deleteDocumentById);

export default router;
