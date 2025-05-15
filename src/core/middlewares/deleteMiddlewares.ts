/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { Model as MongooseModel } from 'mongoose';

export function deleteOtherArtists<T extends Document>(
  Model: MongooseModel<T>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const inputData = req.body;
    if (inputData && inputData.otherArtists.length === 0) {
      const document = await Model.findById(req.params.id);
      if (document) {
        // @ts-ignore
        document.otherArtists = [];
        delete inputData.otherArtists;
        await document.save({ validateBeforeSave: false });
      }
    }
    req.body = inputData;

    next();
  };
}
