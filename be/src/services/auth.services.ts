import UserModal from '~/models/user.model'
import databaseServices from './database.services'
import { IRegisterRequest } from '~/types/auth.type'
import { sha256 } from '~/utils/sha256'
import { generateToken } from '~/utils/jwt'
import { TokenType } from '~/types/auth.enum'

class AuthServices {
  private signAccessToken = (user_id: string) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_MINUTES
      }
    })
  }
  private signRefreshToken = (user_id: string) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signAccessAndRefreshToken = async (user_id: string) => {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  // register
  async register(payload: IRegisterRequest) {
    try {
      const result = await databaseServices.users.insertOne(
        new UserModal({
          ...payload,
          password: sha256(payload.password)
        })
      )
      // get user_id success
      const user_id = result.insertedId.toString()
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
      const result = await databaseServices.refreshTokens.deleteOne({ refresh_token })

      return result
    } catch (error) {
      return error
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
