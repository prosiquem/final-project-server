const { searchTrack, getTracks, getTrack, createTrack, editTrack, deleteTrack } = require('../controllers/track.controllers')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()

router.get('/tracks/search', searchTrack)
router.get('/tracks', getTracks)
router.get('/tracks/:id', getTrack)

router.post('/tracks', verifyToken, createTrack)

router.put('/tracks/:id', editTrack)

router.delete('/tracks/:id', deleteTrack)

module.exports = router