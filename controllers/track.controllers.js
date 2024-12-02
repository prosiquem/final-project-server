const mongoose = require('mongoose')
const Track = require('../models/Track.model')
const Album = require('../models/Album.model')
const User = require('../models/User.model')


const getTracks = (req, res, next) => {

    Track
        .find()
        .select({ title: 1, cover: 1, album: 1, author: 1 })
        .populate('album', 'title')
        .populate('author', 'artistName')
        .then(tracks => {
            res.json(tracks)
        })
        .catch(err => next(err))

}

const getTrack = (req, res, next) => {

    const { id: trackId } = req.params

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Track
        .findById(trackId)
        .populate('album')
        .populate('author')
        .then(track => {
            res.json(track)
        })
        .catch(err => next(err))

}

const searchTrack = (req, res, next) => {

    Track
        .find(req.query)
        .populate('album')
        .populate('author')
        .then(tracks => res.status(200).json(tracks))
        .catch(err => next(err))
}

const createTrack = (req, res, next) => {

    const { album, file, title, order, type, explicit, colabArtists, lyrics } = req.body
    const { _id: author } = req.payload

    Track
        .create({ author, album, file, title, order, type, explicit, colabArtists, lyrics })
        .then(newTrack => {
            res.status(201).json(newTrack)
        })
        .catch(err => next(err))

}

const editTrack = (req, res, next) => {

    const { id: trackId } = req.params
    const { author, album, file, title, order, type, explicit, colabArtists, lyrics } = req.body

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Track
        .findByIdAndUpdate(
            trackId,
            { author, album, file, title, order, type, explicit, colabArtists, lyrics },
            { runValidators: true, new: true })
        .then(() => res.sendStatus(200))
        .catch(err => next(err))

}

const deleteTrack = (req, res, next) => {

    const { id: trackId } = req.params

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Track
        .findByIdAndDelete(trackId)
        .then(deletedTrack => res.sendStatus(200))
        .catch(err => next(err))

}

module.exports = { getTracks, getTrack, searchTrack, createTrack, editTrack, deleteTrack }