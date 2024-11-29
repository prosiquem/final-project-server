const { Schema, model } = require("mongoose")

const albumSchema = Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: [true, 'El nombre del album es obligatorio']
        },
        releaseDate: {
            type: Date,
            required: [true, 'La fecha de lanzamiento es obligatoria']
        },
        musicGenres: [{
            type: String,
            emun: [ "Rock", "Pop", "Jazz", "Blues", "Reggae", "Hip Hop", "Rap", "Country", "Clásica", "Metal", "Funk", "Soul", "Techno", "K-Pop","Bachata","Reggaeton", "Trap", "Indie"] 
        }],
        cover: {
            type: String,
            required: [true, 'La portada es obligatoria']
        },
        credits: {
            producers: {
                type: String
            },
            recordLabel: {
                type: String
            },
            colabArtists: [{
                type: Schema.Types.ObjectId,
                ref: 'User'
            }]
        },
        description: {
            type: String,
        },
        tracks: [{
            type: Schema.Types.ObjectId,
            ref: 'Tracks'
        }]

    },
    {
        timestamps: true
    }
)

const Album = model('Album', albumSchema)
module.exports = Album