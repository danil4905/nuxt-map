const {ResponseStatus} = require('../const');

module.exports = (req, res, next) => {
  if(!req.query.page) {
    res
      .status(ResponseStatus.BAD_REQUEST)
      .send('params page is not defined');
  } else {
    next()
  }
};
