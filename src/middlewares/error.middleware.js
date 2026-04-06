import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../utils/constants.js";

export const notFoundHandler = (req, res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.code === "23505") {
    statusCode = HTTP_STATUS.CONFLICT;
    message = "Duplicate value violates unique constraint";
  }

  if (err.code === "22P02") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = "Invalid input format";
  }

  if (!(err instanceof ApiError) && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error("Unexpected Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};