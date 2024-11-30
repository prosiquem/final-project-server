const router = require('express').Router()

const { getUser, getArtists, editUser, deleteUser } = require('../controllers/user.controllers')

router.get('/artists', getArtists)
router.get('/users/:id', getUser)

router.put('/artists/:id', editUser)

router.delete('/artists/:id', deleteUser)

module.exports = router