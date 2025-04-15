import { NextFunction, Request, Response } from 'express';

export default async function convertReleaseYearToNumber(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.body.releaseYear) req.body.releaseYear = +req.body.releaseYear;
  next();
}
