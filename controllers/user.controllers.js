const mongoose = require('mongoose')

const User = require('../models/User.model')

const getUser = (req, res, next) => {

    const { id: userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    User
        .findById(userId)
        .populate('playlists')
        .then(user => res.status(200).json(user))
        .catch(err => next(err))

}

const getArtists = (req, res, next) => {

    User
        .find({ role: "ARTIST" })
        .populate('playlists', 'name')
        .populate('relatedArtists', ['artistName', 'username'])
        .then(artists => res.status(200).json(artists))
        .catch(err => next(err))
}

const searchArtists = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { artistName, musicGenres } = queryParams

        const query = {}

        if (artistName) query.artistName = new RegExp(artistName, 'i')
        if (musicGenres) {
            const separated = musicGenres.split(', ')
            const genresArr = separated.map((value) => new RegExp(value))
            query.musicGenres = { $all: genresArr }
        }

        return query

    }

    User
        .find({ role: "ARTIST", ...findQuery(req.query) })
        .populate('playlists', 'name')
        .populate('relatedArtists', ['artistName', 'username'])
        .then(artists => {
            res.json(artists)
        })
        .catch(err => next(err))

}

const editUser = (req, res, next) => {

    const { id: userId } = req.params
    const { birth, gender, musicGenres, socialMedia, relatedArtists, playlists } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    User
        .findByIdAndUpdate(
            userId,
            { birth, gender, musicGenres, socialMedia, relatedArtists, playlists },
            { runValidators: true, new: true }
        )
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => next(err))

}

const deleteUser = (req, res, next) => {
    const { id: userId } = req.params
    const { isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    User
        .findByIdAndUpdate(
            userId,
            { isActive },
            { runValidators: true })
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => next(err))
}

module.exports = { getUser, getArtists, searchArtists, deleteUser, editUser }