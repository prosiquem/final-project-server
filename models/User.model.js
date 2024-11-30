const { Schema, model } = require("mongoose")

const userSchema = new Schema(

  {
    email: {
      type: String,
      required: [true, 'El email de usuario es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    username: {
      type: String,
      required: [true, 'El username es obligatorio']
    },
    birth: {
      type: Date,
      required: [true, 'La fecha de nacimiento es obligatoria']
    },
    gender:{
      type: String,
      enum: ['Woman', 'Man', 'Non Binary'],
      required: [true, 'El género es obligatorio']
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'ARTIST'],
      required: [true, 'El rol es obligatorio']
    },
    avatar: {
      type: String,
    },

    //Artist specific
    artistName: {
      type: String,
    },
    musicGenres: [{
     type: String,
     emun: [ "Rock", "Pop", "Jazz", "Blues", "Reggae", "Hip Hop", "Rap", "Country", "Clásica", "Metal", "Funk", "Soul", "Techno", "K-Pop","Bachata","Reggaeton", "Trap", "Indie"] 
    }],
    artistGallery: {
      type: [String]
    },
    description: {
      type: String,
    },
    socialMedia: {
      type: [String],
    },
    relatedArtists: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

  {
       timestamps: true
  }
  
)

const User = model("User", userSchema)
module.exports = User