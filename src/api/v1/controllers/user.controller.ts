import { NextFunction, Request, Response } from 'express';
import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from '../../../core/utils/appError.js';
import catchAsync from '../../../core/utils/catchAsync.js';
import User from '../models/User.js';
import Factory from './factory.controller.js';
import emailSender from '../../../core/utils/emailSender.js';

export default class UserController extends Factory<IUser> {
  constructor() {
    super(User);
  }

  updateMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.password) {
        return next(new Forbidden('cannot update password on this route'));
      }

      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        returnOriginal: false,
      });

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  );

  updateMyPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findById(req.user._id);

      if (user?.password) {
        const verifyPassword = await user?.verifyPassword(
          req.body.currentPassword
        );
        if (!verifyPassword) {
          return next(new BadRequest('Your current password is invalid!'));
        }
      }

      user!.password = req.body.password;
      await user!.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  );

  updateEmail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const checkEmailExists = await User.findOne({
        email: req.body.candidateEmail,
      });

      if (checkEmailExists) {
        return next(new Forbidden('There is a user with this email!'));
      }

      const user = await User.findById(req.user._id);

      user!.candidateEmail = req.body.candidateEmail;
      const verificationCode = await user!.generateVerificationCode(
        'updateEmail'
      );
      await user!.save({ validateBeforeSave: false });

      const html = `<div>${verificationCode}</div>`;

      emailSender(
        res,
        {
          email: req.body.candidateEmail,
          html: html,
          subject: 'Update Email Subject',
          text: 'Update Email text',
        },
        200
      );
    }
  );

  updateEmailVerify = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findById(req.user._id);

      if (!user) {
        return next(new NotFound('There is no user with this id'));
      }

      if (
        !(await user.verifyInputVerificationCode(
          'updateEmail',
          req.body.verificationCode
        ))
      ) {
        return next(new Unauthorized('Invalid or expired code'));
      }

      user.email = user.candidateEmail as string;
      user.candidateEmail = undefined;
      user.updateEmailVerificationCode = undefined;
      user.updateEmailVerificationCodeExpiryDate = undefined;
      user.emailChangedAt = new Date();
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        message: 'Your email updated successfully',
        data: {
          user,
        },
      });
    }
  );
}
