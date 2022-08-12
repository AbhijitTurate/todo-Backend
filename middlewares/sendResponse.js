const sendResponse = (req, res, next, config) => {
  let { statusCode, message, payload } = config;
  if(payload === undefined){
    payload = "";
  }
  res.status(statusCode).json({ message, data: payload });
};

module.exports = sendResponse;