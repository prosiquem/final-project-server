const Playlist = require('../models/Playlist.model')
const mongoose = require('mongoose')


const getPlaylists = (req, res, next) => {

    Playlist
        .find()
        .select({ name: 1, cover: 1, tracks: 1 })
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
        .then(playlist => {
            res.json(playlist)
        })
        .catch(err => next(err))

}

const searchPlaylist = (req, res, next) => {

    const findQuery = (queryParams) => {

        const { name, owner } = queryParams

        const query = {}

        if (name) query.name = new RegExp(name, 'i')
        if (owner) query.owner = new RegExp(owner, 'i')

        return query
    }

    // const sortQuery = (queryParams) => {
    //     const { createdAt, updatedAt } = queryParams

    //     const query = {}

    //     if (createdAt) query.createdAt = 1
    //     if (updatedAt) query.updatedAt = 1

    //     return query
    // }

    Playlist
        .find(findQuery(req.query))
        // .sort(sortQuery(req.query))
        .then(playlists => res.status(200).json(playlists))
        .catch(err => next(err))
}

const createPlaylist = (req, res, next) => {

    const { name, public, cover, description, tracks } = req.body
    const { _id: owner } = req.payload

    Playlist
        .create({ name, public, cover, description, tracks, owner })
        .then(newPlaylist => {
            res.status(201).json(newPlaylist)
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

module.exports = { getPlaylists, getPlaylist, searchPlaylist, createPlaylist, editPlaylist, deletePlaylist }