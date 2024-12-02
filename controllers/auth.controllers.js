const User = require('../models/User.model')
const saltRounds = 12
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUp = (req, res, next) => {

    const {
        email,
        password,
        username,
        birth,
        gender,
        role,
        avatar,
        artistName,
        musicGenres,
        artistGallery,
        description,
        socialMedia,
        relatedArtists
    } = req.body

    if (email === '' || password === '' || username === '' || birth === '' || gender === '' || role === '') {
        res.status(401).json({ message: 'Email, username, paswword, birth date, gender and role are mandatory.' })
        return
    }

    const allowedGender = User.schema.path('gender').enumValues
    if (!allowedGender.includes(gender)) {
        res.status(401).json({ message: 'Gender does not exist' })
        return
    }

    const allowedRoles = User.schema.path('role').enumValues
    if (!allowedRoles.includes(role)) {
        res.status(401).json({ message: 'Role does not exist' })
        return
    }

    if (role === 'ARTIST' && artistName === '') {
        res.status(401).json({ message: 'Artist name is mandatory to register as an artist' })
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(401).json({ message: 'Provide a valid email address.' })
        return
    }

    //esta comprobación se deberá hacer sólo si musicGenres está relleno

    // const allowedMusicGenres= User.schema.path('musicGenres').enumValues
    // if( !Array.isArray(musicGenres) || !musicGenres.every(genre => allowedMusicGenres.includes(genre))){
    //     res.status(400).json({message: 'El género de música no existe'})
    //     return
    // }

    User
        .findOne({ email })
        .then(user => {
            if (user) {
                res.status(401).json({ message: 'User already exists.' })
                return
            }

            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({
                email,
                password: hashedPassword,
                username,
                birth,
                gender,
                role,
                avatar,
                artistName,
                musicGenres,
                artistGallery,
                description,
                socialMedia,
                relatedArtists
            })
        })
        .then(newUser => res.status(201).json(newUser))
        .catch(err => next(err))

}

const logIn = (req, res, next) => {

    const { email, password } = req.body

    if (email === '' || password === '') {
        res.status(401).json({ message: 'Provide email and password.' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.status(401).json({ message: 'User not valid' })
                return
            }

            const isCorrectPwd = bcrypt.compareSync(password, user.password)
            if (!isCorrectPwd) {
                res.status(401).json({ message: 'Password not valid' })
                return
            }

            const { _id, email, username, role, avatar, artistName } = user
            const payload = { _id, email, username, role, avatar, artistName }

            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '6h' }
            )

            res.json({ authToken })
        })

}

const verify = (req, res, next) => {
    res.json({ loggedUserData: req.payload })
}

module.exports = { signUp, logIn, verify }