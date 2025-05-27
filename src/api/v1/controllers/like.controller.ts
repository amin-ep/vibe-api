import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotFound } from '../../../core/utils/appError.js';
import catchAsync from '../../../core/utils/catchAsync.js';
import Album from '../models/Album.js';
import Like from '../models/Like.js';
import Music from '../models/Music.js';
import { IAlbum } from '../types/Album.js';
import { ILike } from '../types/Like.js';
import { IMusic } from '../types/Music.js';
import Factory from './factory.controller.js';

export default class LikeController extends Factory<ILike> {
  constructor() {
    super(Like);
  }

  toggleLike = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let targetModel: IMusic | IAlbum | null = null;
      if (req.body.music) {
        const music = await Music.findOne({ _id: req.body.music });
        targetModel = music as IMusic;
      } else if (req.body.album) {
        const album = await Album.findOne({ _id: req.body.album });
        targetModel = album;
      }

      if (!targetModel) {
        return next(new NotFound(`Invalid id`));
      }

      console.log(targetModel);

      const isLiked = targetModel.likes.some(
        el => el.user.toString() == req.body.user.toString()
      );

      console.log(targetModel.likes);

      if (isLiked) {
        if (req.body.music) {
          await Like.findOneAndDelete({
            user: req.body.user,
            music: req.body.music,
          });
        } else {
          await Like.findOneAndDelete({
            user: req.body.user,
            album: req.body.album,
          });
        }

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

  public setLikeModelOnBody(req: Request, res: Response, next: NextFunction) {
    if (req.params.musicId && !req.body.music) {
      req.body.music = new Types.ObjectId(req.params.musicId);
    }
    if (req.params.albumId && !req.body.album) {
      req.body.album = new Types.ObjectId(req.params.albumId);
    }

    next();
  }
}
