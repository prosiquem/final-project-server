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
        .populate('album', 'title')
        .populate('author', 'artistName')
        .then(track => {
            res.json(track)
        })
        .catch(err => next(err))

}

const searchTrack = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { author, title, minReleaseDate, maxReleaseDate, album } = queryParams

        const query = {}

        if (title) query.title = new RegExp(title, 'i')
        // if (author && author.artistName) query.author.artistName = new RegExp(author, 'i')
        // if (album && author.title) query.album.title = new RegExp(author, 'i')
        if (minReleaseDate) query.createdAt = { $gte: minReleaseDate }
        if (maxReleaseDate) query.createdAt = { $lte: maxReleaseDate }

        return query
    }

    Track
        .find(findQuery(req.query))
        .populate('album', 'title')
        .populate('author', 'artistName')
        .then(tracks => res.status(200).json(tracks))
        .catch(err => next(err))
}

const createTrack = (req, res, next) => {

    const { album, file, title, order, type, explicit, colabArtists, lyrics } = req.body
    const { _id: author } = req.payload

    Track
        .create({ author, album, file, title, order, type, explicit, colabArtists, lyrics })
        .then(newTrack => {
            return Album.findByIdAndUpdate(
                album,
                { $push: { tracks: newTrack._id } },
                { runValidators: true, new: true }
            )

        })
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => next(err))

}

const editTrack = (req, res, next) => {

    const { id: trackId } = req.params
    const { newAlbum: album, oldAlbum, file, title, order, type, explicit, colabArtists, lyrics } = req.body

    if (!mongoose.Types.ObjectId.isValid(trackId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Track
        .findByIdAndUpdate(
            trackId,
            { album, file, title, order, type, explicit, colabArtists, lyrics },
            { runValidators: true, new: true }
        )
        .then(updatedTrack => {

            const promises = [
                Album.findByIdAndUpdate(
                    oldAlbum,
                    { $pull: { tracks: updatedTrack._id } },
                    { runValidators: true }),
                Album.findByIdAndUpdate(
                    album,
                    { $push: { tracks: updatedTrack._id } },
                    { runValidators: true }
                )
            ]

            return Promise.all(promises)
        })
        .then(([oldAlbumResult, newAlbumResult]) => {
            console.log('---1', oldAlbumResult)
            console.log('---2', newAlbumResult)
            res.sendStatus(200)
        })

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