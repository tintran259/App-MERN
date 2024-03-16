import { config } from 'dotenv'
import { MongoClient, Db, Collection } from 'mongodb'
import { Express } from 'express'
import UserModal from '~/models/user.model'
import { NAME_COLLECTION } from '~/constants'

config()
const port = 3000

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.nq5xaah.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseServices {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect(app: Express) {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
      // Run port
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
      })
    } finally {
      // Ensures that the client will close when you finish/error
      // await this.client.close()
    }
  }

  get users(): Collection<UserModal> {
    return this.db.collection(NAME_COLLECTION.USERS)
  }
}

const databaseServices = new DatabaseServices()

export default databaseServices
