'use strict';

const help = require('./help');
const init = require('./init')
const parseUser = require('./parse-user');

const Cli = {
  [help.name]: help,
  [init.name]: init,
  [parseUser.name]: parseUser
};

module.exports = {
  Cli,
};
