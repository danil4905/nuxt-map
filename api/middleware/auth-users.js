'use strict';

const axios = require('axios');
const {ResponseStatus} = require('../const');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if(!authHeader) {
    res
      .status(ResponseStatus.UNAUTHORIZED)
      .send('access denied');
  }

  try {
    const {data} = await axios.get(process.env.OAUTH_HOST + '/resource', {
      headers: {
        Authorization: authHeader
      }
    });

    const roles = data.roles.map((role) => {return role.name});

    if(roles.length < 0) {
      res
        .status(ResponseStatus.UNAUTHORIZED)
        .send('access denied');
    } else {
      next();
    }
  } catch (e) {
    res
      .status(ResponseStatus.SERVER_ERROR)
      .send(e.message);
  }
}
