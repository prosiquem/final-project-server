const mongoose = require('mongoose')

const User = require('../models/User.model')

const getUser = (req, res, next) => {

    const { id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    User
        .findById(userId)
        .then(user => res.status(200).json(user))
        .catch(err => next(err))

}

const getArtists = (req, res, next) => {

    User
        .find({ role: "ARTIST" })
        .then(artists => res.status(200).json(artists))
        .catch(err => next(err))
}

const editUser = (req, res, next) => {
    const { id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    res.json('Edito usuarios')

}

const deleteUser = (req, res, next) => {
    const { id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    res.json('Borro usuarios')
}

module.exports = { getUser, getArtists, deleteUser, editUser }