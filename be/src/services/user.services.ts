import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { errorMessage } from '~/utils/errorMessage'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { ErrorServices } from './error.services'
import { MESSAGE_ERROR } from '~/constants/messageError'
import { UpdateMeReqBody } from '~/types/user.type'
import FollowerModal from '~/models/follower'

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

  async updateMe({ payload, user_id }: { payload: UpdateMeReqBody; user_id: string }) {
    try {
      const user = await databaseServices.users.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            ...payload
          },
          $currentDate: {
            updated_at: true
          }
        },
        {
          returnDocument: 'after',
          projection: {
            password: 0,
            email_verify_token: 0,
            created_at: 0,
            updated_at: 0,
            forgot_password_token: 0
          }
        }
      )
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

  async followerUser({ user_id, follower_user_id }: { user_id: string; follower_user_id: string }) {
    try {
      const findUserIsFollow = await databaseServices.followers.findOne({
        user_id: new ObjectId(user_id),
        follower_user_id: new ObjectId(follower_user_id)
      })

      if (findUserIsFollow) {
        // UnFollow
        await databaseServices.followers.deleteOne({
          user_id: new ObjectId(user_id),
          follower_user_id: new ObjectId(follower_user_id)
        })

        return {
          message: 'Unfollow success'
        }
      } else {
        // Follow
        await databaseServices.followers.insertOne({
          user_id: new ObjectId(user_id),
          follower_user_id: new ObjectId(follower_user_id)
        })

        return {
          message: 'Follow success'
        }
      }
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
