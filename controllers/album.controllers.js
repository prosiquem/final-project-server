const mongoose = require('mongoose')

const Album = require('../models/Album.model')
const User = require('../models/User.model')
const Tracklist = require('../models/Track.model')
const Track = require('../models/Track.model')

const getAlbums = (req, res, next) => {
    Album
        .find()
        .select({ title: 1, author: 1, tracks: 1, cover: 1 })
        .populate('author', ['artistName', 'username'])
        .then(albums => {
            res.json(albums)
        })
        .catch(err => next(err))
}

const getLastAlbums = (req, res, next) => {
    Album
        .find()
        .select({ title: 1, author: 1, tracks: 1, cover: 1 })
        .limit(10)
        .sort({ createdAt: -1 })
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
        .populate({
            path: 'tracks',
            select: ['title', 'author', 'album', 'time', 'file'],
            model: Track,
            populate: [
                { path: 'author', select: ['artistName', 'username'] },
                { path: 'album', select: ['title', 'cover'] }
            ]
        })
        .then(album => {
            res.json(album)
        })
        .catch(err => next(err))
}

const searchAlbum = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { title, minReleaseDate, maxReleaseDate, musicGenres } = queryParams

        const query = {}

        if (title) query.title = new RegExp(title, 'i')
        // if (author && author.artistName) query.author.artistName = new RegExp(author, 'i')
        // if (author) query.author = {username: new RegExp(author, 'i')}
        if (minReleaseDate) query.releaseDate = { $gte: minReleaseDate }
        if (maxReleaseDate) query.releaseDate = { $lte: maxReleaseDate }
        if (musicGenres) {

            const separated = musicGenres.split(', ')
            const regArra = separated.map((value) => new RegExp(value))
            query.musicGenres = { $all: regArra }
        }

        return query
    }

    Album
        .find(findQuery(req.query))
        .then(albums => {
            res.json(albums)
        })
        .catch(err => next(err))
}

const searchArtistsAlbum = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { id: artistId } = queryParams
        const query = {}


        if (artistId) query.author = artistId

        return query

    }

    Album
        .find(findQuery(req.params))
        .limit(4)
        .populate('author')
        .then(albums => {
            res.json(albums)
        })
        .catch(err => next(err))

}

const createAlbum = (req, res, next) => {

    const { title, releaseDate, musicGenres, cover, credits, description, tracks } = req.body
    const { _id: author } = req.payload

    let _id

    Album
        .create({ author, title, releaseDate, musicGenres, cover, credits, description, tracks })
        .then(newAlbum => {

            _id = newAlbum._id

            return (
                User.findByIdAndUpdate(
                    author,
                    { $push: { albums: newAlbum._id } },
                    { runValidators: true, new: true }
                )
            )

        })
        .then(() => {
            res.status(201).json(_id)
        })
        .catch(err => next(err))

}

const editAlbum = (req, res, next) => {

    const { id: albumId } = req.params
    const { title, releaseDate, musicGenres, cover, credits, description, tracks } = req.body

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findByIdAndUpdate(
            albumId,
            { title, releaseDate, musicGenres, cover, credits, description, tracks },
            { runValidators: true, new: true })
        .populate('author', ['artistName', 'username'])
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => next(err))

}

const deleteAlbum = (req, res, next) => {

    const { id: albumId } = req.params
    const { _id: author } = req.payload



    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findByIdAndDelete(albumId)
        .then(deletedAlbum => {

            if (!deletedAlbum) {
                return res.status(404).json({ message: 'Album not found' });
            }

            res.sendStatus(200)

        })
        .catch(err => next(err))

}

module.exports = { getAlbums, getLastAlbums, getAlbum, searchAlbum, createAlbum, editAlbum, deleteAlbum, searchArtistsAlbum }