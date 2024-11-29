const { Schema, model } = require('mongoose')

const trackSchema = Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El autor es necesario']
        },
        album: {
            type: Schema.Types.ObjectId,
            ref: 'Album',
            required: [true, 'El album es necesario']
        },
        file: {
            type: String,
            required: [true, 'El archivo es necesario']
        },
        title: {
            type: String,
            required: [true, 'El nombre es necesario']
        },
        order: {
            type: Number
        },
        type: {
            type: String,
            enum: ['acoustic', 'general', 'speed version', 'remix'],
            required: [true, 'El tipo de canción es necesario']
        },
        explicit: {
            type: Boolean,
            required: [true, 'El explicit es necesario']
        },
        colabArtists: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        lyrics: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

const Track = model('Track', trackSchema)
module.exports = Track