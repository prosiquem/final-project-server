const mongoose = require('mongoose')
const Album = require('../models/Album.model')

const getAlbums = (req, res, next) => {
    Album
        .find()
        .select({ title: 1, author: 1, cover: 1 })
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
        .then(album => {
            res.json(album)
        })
        .catch(err => next(err))
}

const searchAlbum = (req, res, next) => {

    Album
        .find(req.query)
        .then(albums => res.status(200).json(albums))
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
        .then(() => res.sendStatus(200))
        .catch(err => next(err))

}

const deleteAlbum = (req, res, next) => {

    const { id: albumId } = req.params

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Album
        .findByIdAndDelete(albumId)
        .then(deletedAlbum => res.sendStatus(200))
        .catch(err => next(err))

}

module.exports = { getAlbums, getAlbum, searchAlbum, createAlbum, editAlbum, deleteAlbum }