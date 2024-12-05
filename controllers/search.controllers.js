const mongoose = require('mongoose')
const Playlist = require('../models/Playlist.model')
const Album = require('../models/Album.model')
const Track = require('../models/Track.model')
const User = require('../models/User.model')

const searchAll = (req, res, next) => {

    const findQuery = (queryParams) => {
        const { name } = queryParams

        const query = {}

        if (name) query.title = new RegExp(name, 'i')
        if (name) query.name = new RegExp(name, 'i')
        if (name) query.artistName = new RegExp(name, 'i')

        return query
    }

    const query = findQuery(req.query)

    const promises = {
        playlists: Playlist.find({ name: query.name }),
        albums: Album.find({ title: query.title }),
        tracks: Track.find({ title: query.title }),
        artists: User.find({ artistName: query.artistName }),
    }

    Promise.all([
        promises.playlists,
        promises.albums,
        promises.tracks,
        promises.artists,
    ])
        .then(([playlists, albums, tracks, artists]) => {

            res.status(200).json({ playlists, albums, tracks, artists, })
        })
        .catch(err => next(err))
}

module.exports = { searchAll }
