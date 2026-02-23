import { isHttpError } from 'http-errors';

export const errorHandler = ((error, req, res, next) => {
  if (isHttpError(error)) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      data: error,
    });
  }

  console.error(error);
  res.status(500).json({ "message": "Something went wrong" });
});
