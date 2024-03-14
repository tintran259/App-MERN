import { Express } from 'express'
import authRouter from './auth.route'
import userRouter from './users.route'

const appRouter = (app: Express) => {
  // Auth Router
  app.use('/', authRouter)
  // User Router
  app.use('/', userRouter)
}

export default appRouter
