export const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res,
  statusCode,
  message,
  errorCode = "REQUEST_ERROR",
  details = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    details,
  });
};
