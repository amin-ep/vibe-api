import { Router } from 'express';
import Protect from '../../../core/middlewares/protection.js';
import MessageController from '../controllers/message.controller.js';

const router = Router();

const { protect, restrictTo } = new Protect();
const message = new MessageController();

router.use(protect);

router
  .route('/')
  .get(restrictTo('owner'), message.getAllDocuments)
  .post(message.createDocument);

router
  .route('/:id')
  .get(restrictTo('owner'), message.getDocumentById)
  .delete(restrictTo('owner'), message.deleteDocumentById)
  .patch(restrictTo('owner'), message.updateDocumentById);
