const router = require('express').Router()

const { getUser, getArtists, searchArtists, editUser, deleteUser } = require('../controllers/user.controllers')
const verifyToken = require('../middlewares/verifyToken')

router.get('/artists/search', searchArtists)
router.get('/artists', getArtists)
router.get('/users/:id', getUser)

router.put('/users/:id', verifyToken, editUser)

router.delete('/users/:id', verifyToken, deleteUser)

module.exports = router