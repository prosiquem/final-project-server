const { searchAll } = require('../controllers/search.controllers')

const router = require('express').Router()

router.get('/search', searchAll)


module.exports = router