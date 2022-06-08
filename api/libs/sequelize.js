'use strict';

const Sequelize = require('sequelize');

const {PG_HOST, PG_PORT, PG_USER, PG_DB, PG_PASSWORD} = process.env;

const somethingIsNotDefined = [PG_HOST, PG_PORT, PG_USER, PG_DB, PG_PASSWORD].some((it) => it === undefined);

if (somethingIsNotDefined) {
  throw new Error(`One or more environmental variables are not defined`);
}

/**
 * Create client postgres
 */

module.exports = new Sequelize(PG_DB, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  // указываем, с какой СУБД предстоит работать
  dialect: `postgres`,
  // настройки пула соединений
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000
  }
});



