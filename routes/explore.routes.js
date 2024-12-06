const { exploreAll } = require('../controllers/explore.controllers')


const router = require('express').Router()

router.get('/explore', exploreAll)


module.exports = router