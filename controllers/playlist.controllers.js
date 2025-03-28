const mongoose = require('mongoose')

const Playlist = require('../models/Playlist.model')
const Track = require('../models/Track.model')
const Album = require('../models/Album.model')
const User = require('../models/User.model')


const getPlaylists = (req, res, next) => {

    Playlist
        .find()
        .select({ name: 1, cover: 1, tracks: 1, owner: 1 })
        .sort({ createdAt: -1 })
        .populate('tracks', 'title')
        .populate('owner', 'username')
        .then(playlists => {
            res.json(playlists)
        })
        .catch(err => next(err))

}

const getUserPlaylists = (req, res, next) => {

    const { id: userId } = req.params

    User
        .findById(userId)
        .select({ playlists: 1 })
        .populate({
            path: 'playlists',
            select: ['name', 'cover', 'tracks', 'owner'],
            model: Playlist,
            populate: [
                { path: 'tracks', select: ['title'] },
                { path: 'owner', select: ['username'] }
            ]
        })
        .then(userPlaylists => {
            res.json(userPlaylists)
        })
}

const getLastPlaylists = (req, res, next) => {

    Playlist
        .find({ public: true })
        .select({ name: 1, cover: 1, tracks: 1, owner: 1 })
        .limit(10)
        .sort({ createdAt: -1 })
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
            select: ['title', 'author', 'album', 'time', 'file'],
            model: Track,
            populate: [
                { path: 'author', select: ['artistName', 'username'] },
                { path: 'album', select: ['title', 'cover'] }
            ]
        })

        .then(playlist => {
            res.json(playlist)
        })
        .catch(err => next(err))

}

const searchPlaylist = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { title, ownerId } = queryParams

        const query = {}

        if (title) query.name = new RegExp(title, 'i')
        if (ownerId) query.owner = ownerId

        return query
    }

    Playlist
        .find(findQuery(req.query))
        .limit(req.query.maxResult)
        .populate('tracks', 'title')
        .populate('owner', 'username')
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
    const { _id: owner } = req.payload

    const selectQuery = (queryParams) => {

        const { id: playlistId } = queryParams
        const query = {}

        if (playlistId) query.playlists = { $in: [`${playlistId}`] }

        return query

    }


    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        res.status(404).json({ message: 'This id is not valid' })
    }

    Playlist
        .findByIdAndDelete(playlistId)
        .then((deletedPlaylist) => {

            if (!deletedPlaylist) {
                return res.status(404).json({ message: 'Playlist not found' });
            }

            return (User.updateMany(
                selectQuery(req.params),
                { $pull: { playlists: playlistId } },
                { runValidators: true, new: true }
            ))
        })
        .then(users => {
            res.json(users)
        })
        .catch(err => next(err))

}

module.exports = { getPlaylists, getLastPlaylists, getPlaylist, searchPlaylist, createPlaylist, editPlaylist, deletePlaylist, getUserPlaylists }