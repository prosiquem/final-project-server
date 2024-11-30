const router = require('express').Router()

const {signUp, logIn, verify } = require('../controllers/auth.controllers')
const verifyToken = require('../middlewares/verifyToken')

router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/verify', verifyToken, verify)


module.exports = router