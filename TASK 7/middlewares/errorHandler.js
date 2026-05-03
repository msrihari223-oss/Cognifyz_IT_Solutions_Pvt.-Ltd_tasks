module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error('Global Error Handler:', err);

  const status = err.status || 500;
  const message = err.customMessage || err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
  });
};
