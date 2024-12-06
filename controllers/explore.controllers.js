const mongoose = require('mongoose')
const Playlist = require('../models/Playlist.model')
const Album = require('../models/Album.model')
const Track = require('../models/Track.model')
const User = require('../models/User.model')

const exploreAll = (req, res, next) => {

    const albumPromise = Album
        .find()
        .select({ title: 1, author: 1, cover: 1 })
        .populate('author', ['artistName', 'username'])

    const artistPromise = User
        .find({ role: "ARTIST" })
        .populate('playlists', 'name')
        .populate('relatedArtists', ['artistName', 'username'])

    const playlistPromise = Playlist
        .find()
        .select({ name: 1, cover: 1, tracks: 1, owner: 1 })
        .populate('tracks', 'title')
        .populate('owner', 'username')

    Promise.all([albumPromise, artistPromise, playlistPromise])
        .then(([albums, artists, playlists]) => {

            res.json({
                albums,
                artists,
                playlists
            })
        })
        .catch(err => next(err))
}

module.exports = { exploreAll }