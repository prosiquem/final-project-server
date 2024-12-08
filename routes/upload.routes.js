const router = require('express').Router()

const { uploadSingleImage, uploadMultipleImage, uploadTracks } = require('../controllers/upload.controllers')
const uploader = require('./../middlewares/uploader.middleware')

router.post('/image', uploader.single('imageData'), uploadSingleImage)
router.post('/gallery', uploader.array('galleryData', 5), uploadMultipleImage)
router.post('/audio', uploader.any('tracksData'), uploadTracks)

module.exports = router
