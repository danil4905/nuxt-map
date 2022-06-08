const {ResponseStatus} = require('../const');

module.exports = (req, res, next) => {
  if(!req.query.city) {
    res
      .status(ResponseStatus.BAD_REQUEST)
      .send('params city is not defined');
  } else {
    next();
  }
};
