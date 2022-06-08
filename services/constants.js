'use strict';

const USER_ARGV_INDEX = 2;
const DEFAULT_COMMAND = `--help`;
const ExitCode = {
  success: 1,
  error: 0
};

const CONFIG_TEMPLATE_DB = {
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'map',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_EXTERNAL_PORT) || 5432,
  dialect: process.env.DIALECT || 'postgres'
};

const Mode = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
}

module.exports = {
  USER_ARGV_INDEX,
  DEFAULT_COMMAND,
  ExitCode,
  Mode,
  CONFIG_TEMPLATE_DB
}
