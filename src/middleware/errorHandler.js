import { isHttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error)) {
    res.status(error.status).json({
      message: error.message || error.name,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: error.message || 'Something went wrong',
  });
};
