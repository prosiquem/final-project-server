const { searchTrack, getTracks, getTrack, createTrack, editTrack, deleteTrack, createTracks } = require('../controllers/track.controllers')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.get('/tracks/search', searchTrack)
router.get('/tracks', getTracks)
router.get('/tracks/:id', getTrack)

router.post('/track', verifyToken, createTrack)
router.post('/tracks', verifyToken, createTracks)

router.put('/tracks/:id', verifyToken, editTrack)

router.delete('/tracks/:id', verifyToken, deleteTrack)

module.exports = router