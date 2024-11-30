const {Schema, model} = require ('mongoose')

const playlistSchema = Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: [true, 'El dueño es necesario']
        },
        name: {
            type: String,
            required: [true, 'El nombre es necesario']
        },
        public: {
            type: Boolean,
            required: [true, 'La privacidad es necesaria']
        },
        tracks: [{
            type: Schema.Types.ObjectId,
            ref: 'Track'
        }],
        cover: {
            type: String
        },
        description: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

const Playlist = model ('Playlist', playlistSchema)
module.exports = Playlist