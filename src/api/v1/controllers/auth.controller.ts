import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import validate from '../../../core/middlewares/validate.js';
import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from '../../../core/utils/appError.js';
import catchAsync from '../../../core/utils/catchAsync.js';
import emailSender from '../../../core/utils/emailSender.js';
import User from '../models/User.js';
import {
  validateLoginWithEmail,
  validateLoginWithUsername,
} from '../validators/auth.validators.js';

export default class AuthController {
  private generateToken(id: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
    return token;
  }

  private validateEmptyBody() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (
        !req.body ||
        Object.entries(req.body).length == 0 ||
        (!req.body.email && !req.body.username)
      ) {
        return next(new BadRequest('Please fill required fields'));
      }
      next();
    };
  }

  public register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const existingUser = await User.findOne({
        email: req.body.email,
      });

      // user exists with this email
      if (existingUser) {
        if (existingUser.active === true && existingUser.verified === true) {
          return next(new Forbidden('There is a user with this email'));
        }

        if (existingUser.active === false || existingUser.verified === false) {
          // user exists but not active
          existingUser.active = true;
          existingUser.verified = false;
          existingUser.firstName = req.body.firstName ?? undefined;
          existingUser.lastName = req.body.lastName ?? undefined;
          existingUser.username = req.body.username;

          const verificationCode = await existingUser.generateVerificationCode(
            'auth'
          );
          await existingUser.save({ validateBeforeSave: true });

          emailSender(
            res,
            {
              email: req.body.email,
              html: `<div>
                ${verificationCode}
                </div>`,
              subject: 'Email Verification',
              text: 'Verify Email',
            },
            201
          );
        }
      } else {
        // user does not exists
        const newUser = await User.create(req.body);
        const verificationCode = await newUser.generateVerificationCode('auth');
        await newUser.save({ validateBeforeSave: false });

        emailSender(
          res,
          {
            email: req.body.email,
            html: `<div>
              ${verificationCode}
          </div>`,
            subject: 'Email Verification',
            text: 'Verify Email',
          },
          201
        );
      }
    }
  );

  public verifyEmail = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(new NotFound('There is no user with this email!'));
      }

      if (
        !(await user.verifyInputVerificationCode(
          'auth',
          req.body.verificationCode
        ))
      ) {
        return next(new Unauthorized('Invalid or expired code'));
      }

      user.verified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpiryDate = undefined;
      user.verifiedAt = new Date();
      await user.save({ validateBeforeSave: false });
      const token = this.generateToken(user._id);

      res.status(200).json({
        status: 'success',
        token: token,
        data: {
          user,
        },
      });
    }
  );

  public login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      this.validateEmptyBody();

      const checkPasswordAndUser = async (
        user: IUser | null,
        identifier: 'email' | 'username'
      ) => {
        if (
          !user ||
          !(await user.verifyPassword(req.body.password)) ||
          user.active === false
        )
          return next(new NotFound(`Invalid input ${identifier} or password`));

        if (user.verified === false) {
          return next(new Unauthorized('This email is not authorized yet!'));
        }
      };

      const sendResponse = (user: IUser) => {
        const token = this.generateToken(user._id);
        res.status(200).json({
          status: 'success',
          token,
          data: {
            user,
          },
        });
      };

      if (req.body.username) {
        validate(validateLoginWithUsername);
        const user = await User.findOne({ username: req.body.username });

        await checkPasswordAndUser(user, 'username').then(() => {
          sendResponse(user as IUser);
        });
      } else if (req.body.email) {
        validate(validateLoginWithEmail);
        const user = await User.findOne({ email: req.body.email });
        await checkPasswordAndUser(user, 'email').then(() => {
          sendResponse(user as IUser);
        });
      }
    }
  );

  public forgetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(new NotFound('Invalid email!'));
      }

      const recoverId = await user.generateRecoverId();
      await user.save({ validateBeforeSave: false });

      const html = `
          <div>
            <a href="http://localhost:3000/recover-password/${recoverId}">Click</a>
          </div>
          `;

      emailSender(
        res,
        {
          email: req.body.email,
          html: html,
          subject: 'forget password',
          text: 'forget password',
        },
        200
      );
    }
  );

  public resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({
        passwordRecoverId: req.params.recoverId,
      });

      if (!user) {
        return next(new NotFound('Invalid recover id'));
      }

      user.password = req.body.password;
      user.passwordRecoverId = undefined;
      user.passwordChangedAt = new Date();

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        message: 'Your password changed successfully',
      });
    }
  );

  resendVerifyEmailCode = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new NotFound('Invalid email'));
      } else {
        const verificationCode = await user.generateVerificationCode('auth');
        await user.save({ validateBeforeSave: false });
        await emailSender(
          res,
          {
            email: user.email,
            html: `<div>${verificationCode}</div>`,
            subject: 'Verifying email',
            text: 'Do Not Reply',
          },
          200
        );
      }
    }
  );

  checkUserRecoverId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findOne({
        passwordRecoverId: req.params.recoverId,
      });

      if (
        !user ||
        (user &&
          new Date(user.passwordRecoverIdExpiresAt).getTime() < Date.now())
      ) {
        return next(new NotFound('Invalid or expired recover id'));
      } else {
        res.status(200).json({
          status: 'success',
        });
      }
    }
  );
}
