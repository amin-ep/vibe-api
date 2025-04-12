/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response } from 'express';
import { Model as MongooseModel } from 'mongoose';
import catchAsync from '../../../core/utils/catchAsync.js';
import { NotFound } from '../../../core/utils/appError.js';
import ApiFeatures from '../../../core/utils/apiFeatures.js';

export default class Factory<T extends Document> {
  constructor(protected Model: MongooseModel<T>) {}

  getAllDocuments = catchAsync(async (req: Request, res: Response) => {
    const filter = {};

    // @ts-ignore
    if (req.params.movieId) filter.movie = req.params.movieId;
    // @ts-ignore
    const features = new ApiFeatures(this.Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        docs,
      },
    });
  });

  createDocument = catchAsync(async (req: Request, res: Response) => {
    const newDoc = await this.Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        document: newDoc,
      },
    });
  });

  getDocumentById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const document = await this.Model.findById(req.params.id);

      if (!document)
        return next(new NotFound('هیج داده ای با این شناسه وجود ندارد!'));

      res.status(200).json({
        status: 'success',
        data: {
          document,
        },
      });
    }
  );

  updateDocumentById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const updatedDoc = await this.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!updatedDoc) {
        return next(new NotFound(`Invalid Id: ${req.params.id}`));
      }

      res.status(200).json({
        status: 'success',
        data: {
          document: updatedDoc,
        },
      });
    }
  );

  deleteDocumentById = catchAsync(async (req: Request, res: Response) => {
    await this.Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
}
