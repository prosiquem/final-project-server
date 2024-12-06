const router = require('express').Router()

const uploadSingleImage = require('../controllers/upload.controllers')
const uploader = require('./../middlewares/uploader.middleware')

router.post('/image', uploader.single('imageData'), uploadSingleImage)

module.exports = router
