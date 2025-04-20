import { NextFunction, Request, Response } from 'express';

const setMusicFilesOnBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.files && Object.entries(req.files).length > 0) {
    const fields = ['audioFileUrl', 'coverImageUrl'];

    fields.forEach(field => {
      if (!req.body[field]) {
        req.body[field] = (req.files as IRequestFiles)[field][0].filename;
      }
    });
  }

  next();
};

const setArtistImageOnBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    if (!req.body.imageUrl) req.body.imageUrl = req.file.filename;
  }

  next();
};

const setAlbumCoverImageUrlOnBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    if (!req.body.coverImageUrl) req.body.coverImageUrl = req.file.filename;
  }

  next();
};

export {
  setMusicFilesOnBody,
  setArtistImageOnBody,
  setAlbumCoverImageUrlOnBody,
};

export const setUserImageUrlOnBody = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.file) {
    if (!req.body.imageUrl) req.body.imageUrl = req.file.filename;
  }
  next();
};
