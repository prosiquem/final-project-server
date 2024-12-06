const router = require('express').Router()

const { getPlaylists, getLastPlaylists, getPlaylist, searchPlaylist, createPlaylist, editPlaylist, deletePlaylist } = require('../controllers/playlist.controllers')
const verifyToken = require('../middlewares/verifyToken')

router.get('/playlists/last', getLastPlaylists)
router.get('/playlists/search', searchPlaylist)
router.get('/playlists', getPlaylists)
router.get('/playlists/:id', getPlaylist)

router.post('/playlists', verifyToken, createPlaylist)

router.put('/playlists/:id', editPlaylist)

router.delete('/playlists/:id', verifyToken, deletePlaylist)

module.exports = router