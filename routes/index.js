module.exports = app => {

  const authRouter = require('./auth.routes')
  const playlistRouter = require('./playlist.routes')
  const userRouter = require('./user.routes')

  app.use('/api', authRouter)
  //albums
  //tracks
  app.use('/api', playlistRouter)
  app.use('/api', userRouter)

}