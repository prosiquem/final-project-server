const { searchAlbum, getAlbums, getAlbum, createAlbum, editAlbum, deleteAlbum, searchArtistsAlbum } = require('../controllers/album.controllers')
const verifyToken = require('../middlewares/verifyToken')

const router = require('express').Router()


router.get('/albums/search', searchAlbum)
router.get('/albums/search/:id', searchArtistsAlbum)
router.get('/albums', getAlbums)
router.get('/albums/:id', getAlbum)

router.post('/albums', verifyToken, createAlbum)

router.put('/albums/:id', editAlbum)

router.delete('/albums/:id', deleteAlbum)

module.exports = router