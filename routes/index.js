module.exports = app => {

  const authRouter = require('./auth.routes')
  const playlistRouter = require('./playlist.routes')
  const userRouter = require('./user.routes')
  const albumRouter = require('./album.routes')
  const trackRouter = require('./track.routes')
  const searchRouter = require('./search.routes')
  const exploreRouter = require('./explore.routes')
  const uploadRouter = require('./upload.routes')

  app.use('/api', authRouter)
  app.use('/api', albumRouter)
  app.use('/api', trackRouter)
  app.use('/api', playlistRouter)
  app.use('/api', userRouter)
  app.use('/api', searchRouter)
  app.use('/api', exploreRouter)
  app.use('/upload', uploadRouter)

}