const sendResponse = (req, res, next, config) => {
  const { statusCode, message, payload } = config;
  res.status(statusCode).json({ message, data: payload });
};

module.exports = sendResponse;