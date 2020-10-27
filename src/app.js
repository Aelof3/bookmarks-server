require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

const app = express()

/*
 * Set up pipeline
 * - add morgan for request logging
 * - add cors to make handling cors easier
 * - add helmet to add security by setting various headers
 * - validatebearertoken does not do anything right now, hence dummy api token
 * 
 * bookmarksRouter to handle requests using the pipeline
 * set up base path listener on / with simple hello world
 * 
 * include error handler in pipeline
 * 
 * add app to module.exports
 */
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(bookmarksRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(errorHandler)

module.exports = app
