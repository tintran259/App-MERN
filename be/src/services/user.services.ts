import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { errorMessage } from '~/utils/errorMessage'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { ErrorServices } from './error.services'
import { MESSAGE_ERROR } from '~/constants/messageError'

class UserServices {
  async getMe({ user_id }: { user_id: string }) {
    try {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
      return user
    } catch (error) {
      errorMessage({
        error,
        errorDefault: {
          message: MESSAGE_ERROR.USER_NOT_FOUND,
          statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
        }
      })
    }
  }
}

const userServices = new UserServices()

export default userServices
