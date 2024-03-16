import UserModal from '~/models/user.model'
import databaseServices from './database.services'

class AuthServices {
  async register(payload: {
    email: string
    password: string
    name: string
    confirm_password: string
    date_of_birth: Date
  }) {
    try {
      const result = await databaseServices.users.insertOne(new UserModal(payload))
      return result
    } catch (error) {
      return error
    }
  }

  async checkEmailExit(email: string) {
    try {
      const result = await databaseServices.users.findOne({ email })
      return !!result
    } catch (error) {
      return error
    }
  }
}

const authServices = new AuthServices()

export default authServices
