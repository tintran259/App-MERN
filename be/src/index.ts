import express from 'express'
import mongoose from 'mongoose'
import appRouter from '~/routes'

const app = express()
const port = 3000
// Router
app.use(express.json())
appRouter(app)
// Connect Database
mongoose
  .connect(
    'mongodb+srv://tintran2591999:tin1999123@twitter.nq5xaah.mongodb.net/?retryWrites=true&w=majority&appName=Twitter',
    {}
  )
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log('Start Server 13 on http://localhost:3000')
    })
  })
  .catch((error) => {
    console.log('Error:', error)
  })
