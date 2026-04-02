const { HTTP_STATUS } = require("../utils/constants");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  console.error(`❌ Error [${statusCode}]:`, message);

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

module.exports = errorMiddleware;
