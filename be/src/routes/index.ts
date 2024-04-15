import express, { Express } from 'express'
import authRouter from './auth.route'
import userRouter from './users.route'
import mediasRouter from './medias.route'
import staticRouter from './static.route'
import { IMAGE_FOLDER_MAIN_DIR } from '~/constants/mediaFolder'

const appRouter = (app: Express) => {
  // Auth Router
  app.use('/', authRouter)
  // User Router
  app.use('/', userRouter)
  // Media Router
  app.use('/', mediasRouter)
  // static file
  // app.use('/uploads', express.static(IMAGE_FOLDER_MAIN_DIR))
  app.use('/uploads', staticRouter)
}

export default appRouter
