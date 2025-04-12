import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import validate from '../../../core/middlewares/validate.js';
import {
  validateForgetPassword,
  validateRegister,
  validateResetPassword,
  validateVerifyEmail,
} from '../validators/auth.validators.js';

const router = Router();

const auth = new AuthController();

router.post('/register', validate(validateRegister), auth.register);
router.post('/verify', validate(validateVerifyEmail), auth.verifyEmail);
router.post('/login', auth.login);
router.post(
  '/forgetPassword',
  validate(validateForgetPassword),
  auth.forgetPassword
);

router.patch(
  '/recoverPassword/:recoverId',
  validate(validateResetPassword),
  auth.resetPassword
);

export default router;
