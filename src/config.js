/*
 * basic config
 * - PORT: environment port or 8000, as usual
 * - NODE_ENV: check for dev or prod
 * - API_TOKEN: Not used as of now, hence dummy api token
 */
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
}
