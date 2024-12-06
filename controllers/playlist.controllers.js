const mongoose = require('mongoose')

const Playlist = require('../models/Playlist.model')
const Track = require('../models/Track.model')
const Album = require('../models/Album.model')
const User = require('../models/User.model')


const getPlaylists = (req, res, next) => {

    Playlist
        .find()
        .select({ name: 1, cover: 1, tracks: 1, owner: 1 })
        .populate('tracks', 'title')
        .populate('owner', 'username')
        .then(playlists => {
            res.json(playlists)
        })
        .catch(err => next(err))

}

const getLastPlaylists = (req, res, next) => {

    Playlist
        .find()
        .select({ name: 1, cover: 1, tracks: 1, owner: 1 })
        .sort({ createdAt: 1 })
        .populate('tracks', 'title')
        .populate('owner', 'username')
        .then(playlists => {
            res.json(playlists)
        })
        .catch(err => next(err))

}

const getPlaylist = (req, res, next) => {

    const { id: playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Playlist
        .findById(playlistId)
        .populate('owner', 'username')
        .populate({
            path: 'tracks',
            select: ['title', 'author', 'album', 'time'],
            model: Track,
            populate: [
                { path: 'author', select: ['artistName', 'username'] },
                { path: 'album', select: 'title' }
            ]
        })

        .then(playlist => {
            res.json(playlist)
        })
        .catch(err => next(err))

}

const searchPlaylist = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { title, owner } = queryParams

        const query = {}

        // if (title) query.name = new RegExp(title, 'i')
        if (owner) query.owner = new RegExp(owner, 'i')

        return query
    }

    Playlist
        .find(findQuery(req.query))
        .populate('tracks', 'title')
        .then(playlists => res.status(200).json(playlists))
        .catch(err => next(err))
}

const createPlaylist = (req, res, next) => {

    const { name, public, cover, description, tracks } = req.body
    const { _id: owner } = req.payload

    let _id

    Playlist
        .create({ name, public, cover, description, tracks, owner })
        .then(newPlaylist => {

            _id = newPlaylist._id

            return (
                User.findByIdAndUpdate(
                    owner,
                    { $push: { playlists: newPlaylist._id } },
                    { runValidators: true, new: true }
                )
            )
        })
        .then(() => {
            res.status(201).json(_id)
        })
        .catch(err => next(err))

}

const editPlaylist = (req, res, next) => {

    const { id: playlistId } = req.params
    const { name, public, cover, description, tracks } = req.body

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Playlist
        .findByIdAndUpdate(
            playlistId,
            { name, public, cover, description, tracks },
            { runValidators: true, new: true })
        .then(() => res.sendStatus(200))
        .catch(err => next(err))

}

const deletePlaylist = (req, res, next) => {

    const { id: playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Playlist
        .findByIdAndDelete(playlistId)
        .then(() => res.sendStatus(200))
        .catch(err => next(err))

}

module.exports = { getPlaylists, getLastPlaylists, getPlaylist, searchPlaylist, createPlaylist, editPlaylist, deletePlaylist }