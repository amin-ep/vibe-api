import { NextFunction, Request, Response } from 'express';

export default async function setUserOnBody(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.log(req.body);

  if (!req.body.user) {
    console.log(req.user);

    req.body.user = req.user._id;
  }
  next();
}
