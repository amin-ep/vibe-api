import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../core/utils/catchAsync.js';
import Playlist from '../models/Playlist.js';
import { IPlaylist } from '../types/Playlist.js';
import Factory from './factory.controller.js';
import { NotFound } from '../../../core/utils/appError.js';

export default class PlaylistController extends Factory<IPlaylist> {
  constructor() {
    super(Playlist);
  }

  getMyPlaylists = catchAsync(async (req: Request, res: Response) => {
    const playlists = await Playlist.find({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      data: playlists,
    });
  });

  addMusicToPlaylist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const playlist = await Playlist.findById(req.params.listId);

      if (!playlist) {
        return next(new NotFound('There is no playlist with this id!'));
      }

      playlist.musics = [...playlist.musics, req.body.musics];
      await playlist.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        message: 'Added to list successfully',
        data: {
          document: playlist,
        },
      });
    }
  );

  deleteMusicFromPlaylist = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const playlist = await Playlist.findById(req.params.listId);

      if (!playlist) {
        return next(new NotFound('There is no playlist with this id!'));
      }

      if (playlist.musics) {
        for (let i = 0; i < req.body.deletedItems.length; i++) {
          playlist.musics = playlist.musics.filter(
            el => el._id != req.body.deletedItems[i]
          );
        }
        await playlist.save({ validateBeforeSave: false });
      }

      res.status(204).json({
        status: 'success',
        data: playlist,
      });
    }
  );
}
