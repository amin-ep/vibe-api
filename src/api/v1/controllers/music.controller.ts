import { Request, Response } from 'express';
import catchAsync from '../../../core/utils/catchAsync.js';
import Music from '../models/Music.js';
import { IMusic } from '../types/Music.js';
import Factory from './factory.controller.js';

export default class MusicController extends Factory<IMusic> {
  constructor() {
    super(Music);
  }

  getMusicStats = catchAsync(async (req: Request, res: Response) => {
    const data = await Music.aggregate([
      {
        $facet: {
          musicsPerCategory: [
            { $unwind: '$categories' },
            { $group: { _id: '$categories', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          musicsPerGenre: [
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          musicsPerArtist: [
            {
              $project: {
                allArtists: {
                  $concatArrays: [
                    [{ $ifNull: ['$artist', null] }],
                    { $ifNull: ['$otherArtists', []] },
                  ],
                },
              },
            },

            { $unwind: '$allArtists' },

            {
              $group: {
                _id: '$allArtists',
                count: { $sum: 1 },
              },
            },

            {
              $lookup: {
                from: 'artists',
                localField: '_id',
                foreignField: '_id',
                as: 'artist',
              },
            },
            { $unwind: '$artist' },

            {
              $project: {
                _id: 0,
                artistId: '$_id',
                name: '$artist.name',
                count: 1,
              },
            },

            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: data[0],
    });
  });
}
