const express = require('express')
const uuid = require('uuid/v4')
const { isWebUri } = require('valid-url')
const logger = require('../logger')
const store = require('../data-store')

const bookmarksRouter = express.Router()

// lets us parse json data from request params
const bodyParser = express.json()

/*
 * /bookmarks
 * - GET: gets list of all bookmarks in store
 * - POST: adds new bookmark to store after validation
 */
bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks)
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { title, url, description, rating } = req.body

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }

    const bookmark = { id: uuid(), title, url, description, rating }

    store.bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })


/*
 * /bookmarks/:id
 * - GET: gets single bookmark with :id
 * - DELETE: deletes bookmark with :id
 * - TODO: (PUT: updates fields for bookmark with :id)
 */
bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params

    const bookmark = store.bookmarks.find(bookmark => bookmark.id == id)

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params

    const bookmarkIndex = store.bookmarks.findIndex(bookmark => bookmark.id === id)

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`)
    res
      .status(204)
      .end()
  })

module.exports = bookmarksRouter
