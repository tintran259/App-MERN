import express, { NextFunction, Request, Response } from 'express'
import appRouter from '~/routes'
import databaseServices from './services/database.services'
import { ErrorServices } from './services/error.services'
import { STATUS_NAMING } from './constants/statusNaming'

const app = express()
// Parse request body JSON
app.use(express.json())
// Router
appRouter(app)
// Connect Database
databaseServices.connect(app)
// Handle error
app.use((err: ErrorServices, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.statusCode || STATUS_NAMING.INTERNAL_SERVER_ERROR).json({ errors: err })
})
