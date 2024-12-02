const mongoose = require('mongoose')
const Album = require('../models/Album.model')
const User = require('../models/User.model')
const Tracklist = require('../models/Track.model')

const getAlbums = (req, res, next) => {
    Album
        .find()
        .select({ title: 1, author: 1, cover: 1 })
        .populate('author', ['artistName', 'username'])
        .then(albums => {
            res.json(albums)
        })
        .catch(err => next(err))
}

const getAlbum = (req, res, next) => {

    const { id: albumId } = req.params

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findById(albumId)
        .populate('author', ['artistName', 'username'])
        .then(album => {
            res.json(album)
        })
        .catch(err => next(err))
}

const searchAlbum = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { author, title, minReleaseDate, maxReleaseDate, musicGenres } = queryParams

        const query = {}

        if (title) query.title = new RegExp(title, 'i')
        // if (author && author.artistName) query.author.artistName = new RegExp(author, 'i')
        // if (author) query.author = {username: new RegExp(author, 'i')}
        if(minReleaseDate) query.releaseDate = {$gte: minReleaseDate}
        if(maxReleaseDate) query.releaseDate = {$lte: maxReleaseDate}

        const musicGenresArr = []
        if (musicGenres && musicGenres.length > 0)  query.musicGenres = { $in: musicGenres }

        return query
    }

    Album
        .find(findQuery(req.query))
        .populate('author', ['artistName', 'username'])
        .then(albums => {
            res.status(200).json(albums)
        })
        .catch(err => next(err))
}

const createAlbum = (req, res, next) => {

    const { title, releaseDate, musicGenres, cover, credits, description, tracks } = req.body
    const { _id: author } = req.payload

    Album
        .create({ author, title, releaseDate, musicGenres, cover, credits, description, tracks })
        .then(newAlbum => {
            res.status(201).json(newAlbum)
        })
        .catch(err => next(err))

}

const editAlbum = (req, res, next) => {

    const { id: albumId } = req.params
    const { author, title, releaseDate, musicGenres, cover, credits, description, tracks } = req.body

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findByIdAndUpdate(
            albumId,
            { author, title, releaseDate, musicGenres, cover, credits, description, tracks },
            { runValidators: true, new: true })
        .populate('author', ['artistName', 'username'])
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => next(err))

}

const deleteAlbum = (req, res, next) => {

    const { id: albumId } = req.params

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findByIdAndDelete(albumId)
        .then(deletedAlbum => {
            res.sendStatus(200)
        })
        .catch(err => next(err))

}

module.exports = { getAlbums, getAlbum, searchAlbum, createAlbum, editAlbum, deleteAlbum }