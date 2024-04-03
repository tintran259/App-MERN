import express, { NextFunction, Request, Response } from 'express'
import appRouter from '~/routes'
import databaseServices from './services/database.services'
import { ErrorServices } from './services/error.services'
import { STATUS_NAMING } from './constants/statusNaming'
import { initFolder } from './utils/initFolder'

// create folder uploads
initFolder()
const app = express()
// Parse request body JSON
app.use(express.json())
// Router
appRouter(app)
// Connect Database
databaseServices.connect(app)
// Handle error
app.use((err: ErrorServices, req: Request, res: Response, next: NextFunction): void => {
  console.log(':err 111111111111', err, res)

  res.status(err.statusCode || STATUS_NAMING.INTERNAL_SERVER_ERROR).json({ errors: err })
})
