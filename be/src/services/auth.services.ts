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
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken(user_id),
        this.signRefreshToken(user_id)
      ])

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
        const [access_token, refresh_token] = await Promise.all([
          this.signAccessToken(user_id),
          this.signRefreshToken(user_id)
        ])

        return {
          access_token,
          refresh_token
        }
      }
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
