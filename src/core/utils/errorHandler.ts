import { Request, Response, NextFunction } from 'express';
import AppError, { NotFound, Unauthorized } from './appError.js';

const sendDevelopmentError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendProductionError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong from server!',
    });
  }
};

const handleCastError = (err: AppError) => {
  //@ts-ignore
  const message = `Invalid Id: ${err.value}`;
  return new NotFound(message);
};

const handleTokenExpiredError = () => {
  return new Unauthorized('The token has been expired. Please login again!');
};

const handleJWTError = () => {
  return new Unauthorized('Invalid token. Please Login again!');
};

const handleLargePayloadError = (err: AppError) => {
  return new AppError(err.message, 413);
};

// const handleDuplicateKeyError = (err: AppError & {errmsg: }, req: Request) => {
//   const values = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   const message = `Duplicate field: ${values}. please use another value!`;
//   return new BadRequest(message);
// };

export default function (
  err: AppError & { code?: number },
  req: Request,
  res: Response,
  _next: NextFunction
) {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if ((process.env.NODE_ENV as string) === 'development') {
    sendDevelopmentError(err, res);
  } else {
    if (err.name === 'CastError') err = handleCastError(err);
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError();
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.statusCode === 413) err = handleLargePayloadError(err);
    // if (err.code === 11000) err = handleDuplicateKeyError(err, req);
    sendProductionError(err, res);
  }
}
