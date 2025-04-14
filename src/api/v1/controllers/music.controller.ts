import { NextFunction, Request, Response } from 'express';
import Music from '../models/Music.js';
import { IMusic } from '../types/Music.js';
import Factory from './factory.controller.js';

export default class MusicController extends Factory<IMusic> {
  constructor() {
    super(Music);
  }

  public async convertReleaseYearToNumber(
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    if (req.body.releaseYear) req.body.releaseYear = +req.body.releaseYear;
    next();
  }
}
