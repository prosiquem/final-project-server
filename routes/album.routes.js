const { searchAlbum, getAlbums, createAlbum, editAlbum, deleteAlbum } = require('../controllers/album.controllers')

const router = require('express').Router()


router.get('/albums/search', searchAlbum)
router.get('/albums', getAlbums)
router.get('albums/:id', getAlbums)

router.post('/albums', createAlbum)

router.put('/albums/:id', editAlbum)

router.delete('/albums/:id', deleteAlbum)

module.exports = router