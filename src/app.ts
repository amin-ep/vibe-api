import express, { NextFunction, Request, Response } from 'express';
import authRoutesV1 from './api/v1/routes/auth.routes.js';
import { NotFound } from './core/utils/appError.js';
import globalErrorHandler from './core/utils/errorHandler.js';

const app = express();

declare module 'express-serve-static-core' {
  interface Request {
    user: IUser;
  }
}

app.use(express.json());

app.use('/api/v1/auth', authRoutesV1);

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(
    new NotFound(`This route is not yet defined: ${req.originalUrl}`)
  );
});

app.use(globalErrorHandler);

export default app;
