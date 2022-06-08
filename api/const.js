const ResponseStatus = {
  SUCCESS: 200,
  CREATE: 201,
  BAD_REQUEST: 400,
  NO_TOKEN: 401,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

module.exports = {
  ResponseStatus
}
export const jwtConfig = {
  secret: "istuOfficeMap",
  jwtExpiration: 1800, // 30 min
  jwtRefreshExpiration: 86400, // 24 hours
}
