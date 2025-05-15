import express, { NextFunction, Request, Response } from 'express';
import authRoutesV1 from './api/v1/routes/auth.routes.js';
import userRouterV1 from './api/v1/routes/user.routes.js';
import artistRouterV1 from './api/v1/routes/artist.routes.js';
import musicRouterV1 from './api/v1/routes/music.routes.js';
import albumRouterV1 from './api/v1/routes/album.routes.js';
import { NotFound } from './core/utils/appError.js';
import globalErrorHandler from './core/utils/errorHandler.js';
import playlistRouterV1 from './api/v1/routes/playlist.routes.js';
import cors from 'cors';

const app = express();

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

app.use(express.json());

app.use(cors());

app.use('/static', express.static('uploads'));

app.use('/api/v1/auth', authRoutesV1);
app.use('/api/v1/user', userRouterV1);
app.use('/api/v1/artist', artistRouterV1);
app.use('/api/v1/music', musicRouterV1);
app.use('/api/v1/album', albumRouterV1);
app.use('/api/v1/playlist', playlistRouterV1);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new NotFound(`This route is not yet defined: ${req.originalUrl}`)
  );
});

app.use(globalErrorHandler);

export default app;
