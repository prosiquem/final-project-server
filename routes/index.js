module.exports = app => {

  const authRouter = require('./auth.routes')
  const playlistRouter = require('./playlist.routes')
  const userRouter = require('./user.routes')
  const albumRouter = require('./album.routes')
  const trackRouter = require('./track.routes')

  app.use('/api', authRouter)
  app.use('/api', albumRouter)
  app.use('/api', trackRouter)
  app.use('/api', playlistRouter)
  app.use('/api', userRouter)

}