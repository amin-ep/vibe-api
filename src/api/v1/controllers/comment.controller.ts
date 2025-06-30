import Factory from './factory.controller.js';
import Comment from '../models/Comment.js';
import { IComment } from '../types/Comment.js';
import catchAsync from '../../../core/utils/catchAsync.js';
import { NextFunction, Request, Response } from 'express';
import { BadRequest } from '../../../core/utils/appError.js';

export default class CommentController extends Factory<IComment> {
  constructor() {
    super(Comment);
  }

  getPublishedComments = catchAsync(async (_req: Request, res: Response) => {
    const comments = await Comment.find({ published: true });

    res.status(200).json({
      status: 'success',
      result: comments.length,
      data: {
        comments,
      },
    });
  });

  checkCommentTargetModel = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.album && !req.body.music) {
        return next(
          new BadRequest('Each comment must be on an album or a music')
        );
      }
      next();
    }
  );
}
