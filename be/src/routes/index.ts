import { Express } from 'express'
import authRouter from './auth.route'
import userRouter from './users.route'
import mediasRouter from './medias.route'

const appRouter = (app: Express) => {
  // Auth Router
  app.use('/', authRouter)
  // User Router
  app.use('/', userRouter)
  // Media Router
  app.use('/', mediasRouter)
}

export default appRouter
