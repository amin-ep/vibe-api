import { NextFunction, Request, Response } from 'express';
import { BadRequest, Forbidden } from '../../../core/utils/appError.js';
import catchAsync from '../../../core/utils/catchAsync.js';
import User from '../models/User.js';
import Factory from './factory.controller.js';

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
}
