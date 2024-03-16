import express, { NextFunction, Request, Response } from 'express'
import appRouter from '~/routes'
import databaseServices from './services/database.services'

const app = express()
// Parse request body JSON
app.use(express.json())
// Router
appRouter(app)
// Connect Database
databaseServices.connect(app)
// Handle error
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).json({ message: err.message })
})
