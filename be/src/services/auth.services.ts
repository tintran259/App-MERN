import { ObjectId } from 'mongodb'
// models
import UserModal from '~/models/user.model'
// services
import { ErrorServices } from './error.services'
import databaseServices from './database.services'
// others
import { sha256 } from '~/utils/sha256'
import { generateToken } from '~/utils/jwt'
import { TokenType } from '~/types/auth.enum'
import { errorMessage } from '~/utils/errorMessage'
import { IRegisterRequest } from '~/types/auth.type'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { MESSAGE_ERROR } from '~/constants/messageError'

class AuthServices {
  private signAccessToken = (user_id: string) => {
    return generateToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_MINUTES
      }
    })
  }
  private signRefreshToken = (user_id: string) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signEmailVerifyToken = (user_id: string) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signAccessAndRefreshToken = async (user_id: string) => {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  // register
  async register(payload: IRegisterRequest) {
    try {
      const _id = new ObjectId()
      const user_id = _id.toString()

      const email_verify_token = await this.signEmailVerifyToken(user_id)

      await databaseServices.users.insertOne(
        new UserModal({
          ...payload,
          _id,
          password: sha256(payload.password),
          email_verify_token
        })
      )
      // generate token
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

      // save refresh token to database
      await databaseServices.refreshTokens.insertOne({
        user_id,
        refresh_token
      })

      return {
        email_verify_token,
        access_token,
        refresh_token
      }
    } catch (error) {
      return error
    }
  }

  // login
  async login({ user_id }: { user_id?: string }) {
    try {
      if (user_id) {
        // generate token
        const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
        // save refresh token to database
        await databaseServices.refreshTokens.insertOne({
          user_id,
          refresh_token
        })

        return {
          access_token,
          refresh_token
        }
      }
    } catch (error) {
      return error
    }
  }

  async logout({ refresh_token }: { refresh_token?: string }) {
    try {
      await databaseServices.refreshTokens.deleteOne({ refresh_token })
      return true
    } catch (error) {
      return error
    }
  }

  async emailVerify({ user_id }: { user_id?: string }) {
    try {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        throw new ErrorServices({
          message: MESSAGE_ERROR.USER_NOT_FOUND,
          statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
        })
      } else {
        if (user.email_verify_token === '') {
          throw new ErrorServices({
            message: MESSAGE_ERROR.EMAIL_VERIFIED_BEFORE,
            statusCode: STATUS_NAMING.SUCCESS
          })
        }
        await databaseServices.users.updateOne(
          {
            _id: new ObjectId(user_id)
          },
          {
            $set: {
              email_verify_token: ''
            }
          }
        )
      }

      return true
    } catch (error) {
      errorMessage({
        error,
        errorDefault: {
          message: MESSAGE_ERROR.EMAIL_VERIFY_TOKEN_REQUIRED,
          statusCode: STATUS_NAMING.UNAUTHORIZED
        }
      })
    }
  }

  // check email exit
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
