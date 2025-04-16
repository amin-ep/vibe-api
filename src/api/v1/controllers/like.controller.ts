import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../core/utils/catchAsync.js';
import Like from '../models/Like.js';
import { ILike } from '../types/Like.js';
import Factory from './factory.controller.js';
import Music from '../models/Music.js';
import { Types } from 'mongoose';
import { NotFound } from '../../../core/utils/appError.js';

export default class LikeController extends Factory<ILike> {
  constructor() {
    super(Like);
  }

  toggleLike = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const music = await Music.findOne({ _id: req.body.music });

      if (!music) {
        return next(new NotFound(`Invalid Music id: ${req.body.music}`));
      }
      const isLiked = music.likes.some(
        el => el.user.toString() === req.body.user.toString()
      );

      if (isLiked) {
        await Like.findOneAndDelete({
          user: req.body.user,
          music: req.body.music,
        });

        res.status(200).json({
          status: 'success',
          data: null,
        });
      } else {
        const newLike = await Like.create(req.body);

        res.status(200).json({
          status: 'success',
          data: {
            newLike,
          },
        });
      }
    }
  );

  public setMusicOnBody(req: Request, res: Response, next: NextFunction) {
    if (req.params.musicId && !req.body.music)
      req.body.music = new Types.ObjectId(req.params.musicId);

    next();
  }
}
