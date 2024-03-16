import express from 'express'
import appRouter from '~/routes'
import databaseServices from './services/database.services'

const app = express()
// Router
app.use(express.json())

appRouter(app)
// Connect Database
databaseServices.connect(app)
