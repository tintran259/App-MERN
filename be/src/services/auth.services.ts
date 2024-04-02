import { ObjectId } from 'mongodb'
// models
import UserModal from '~/models/user.model'
// services
import { ErrorServices } from './error.services'
import databaseServices from './database.services'
// others
import { sha256 } from '~/utils/sha256'
import { generateToken } from '~/utils/jwt'
import { TokenType, VerifyStatus } from '~/types/auth.enum'
import { errorMessage } from '~/utils/errorMessage'
import { IRegisterRequest } from '~/types/auth.type'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { MESSAGE_ERROR } from '~/constants/messageError'

class AuthServices {
  private signAccessToken = ({ user_id, verify }: { user_id: string; verify: VerifyStatus }) => {
    return generateToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_MINUTES
      }
    })
  }
  private signRefreshToken = ({ user_id, verify }: { user_id: string; verify: VerifyStatus }) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signEmailVerifyToken = ({ user_id, verify }: { user_id: string; verify: VerifyStatus }) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signForgotPasswordToken = ({ user_id, verify }: { user_id: string; verify: VerifyStatus }) => {
    return generateToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      secretOrPrivateKey: process.env.JWT_SECRET_KEY_FORGOT_PASSWORD as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_MINUTES
      }
    })
  }

  private signAccessAndRefreshToken = async ({ user_id, verify }: { user_id: string; verify: VerifyStatus }) => {
    return Promise.all([
      this.signAccessToken({
        user_id,
        verify
      }),
      this.signRefreshToken({
        user_id,
        verify
      })
    ])
  }

  // register
  async register(payload: IRegisterRequest) {
    try {
      const _id = new ObjectId()
      const user_id = _id.toString()

      const email_verify_token = await this.signEmailVerifyToken({
        user_id,
        verify: VerifyStatus.unverified
      })

      await databaseServices.users.insertOne(
        new UserModal({
          ...payload,
          _id,
          password: sha256(payload.password),
          email_verify_token
        })
      )
      // generate token
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id,
        verify: VerifyStatus.unverified
      })

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
  async login({ user_id, verify }: { user_id?: string; verify?: VerifyStatus }) {
    try {
      if (user_id) {
        // generate token
        const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
          user_id,
          verify: verify || VerifyStatus.unverified
        })
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
        if (user.email_verify_token === '' && user.verify === VerifyStatus.verified) {
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
              email_verify_token: '',
              verify: VerifyStatus.verified
            },
            $currentDate: {
              updated_at: true
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

  // resend email verify

  async resendEmailVerify({ user_id }: { user_id: string }) {
    try {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
      if (!user) {
        throw new ErrorServices({
          message: MESSAGE_ERROR.USER_NOT_FOUND,
          statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
        })
      }
      if (user.verify === VerifyStatus.verified) {
        throw new ErrorServices({
          message: MESSAGE_ERROR.EMAIL_VERIFIED_BEFORE,
          statusCode: STATUS_NAMING.SUCCESS
        })
      }

      // update email verify token for user
      await databaseServices.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            email_verify_token: await this.signEmailVerifyToken({
              user_id,
              verify: VerifyStatus.unverified
            })
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
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

  // forgot password

  async forgotPassword({ user_id, verify }: { user_id: string; verify: VerifyStatus }) {
    try {
      const tokenForgotPassword = await this.signForgotPasswordToken({
        user_id,
        verify
      })
      await databaseServices.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            forgot_password_token: tokenForgotPassword
          },
          $currentDate: {
            updated_at: true
          }
        }
      )

      return {
        forgot_password_token: tokenForgotPassword
      }
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

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    try {
      await databaseServices.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            password: sha256(password),
            forgot_password_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } catch (error) {
      errorMessage({
        error,
        errorDefault: {
          message: MESSAGE_ERROR.RESET_PASSWORD_TOKEN_REQUIRED,
          statusCode: STATUS_NAMING.UNAUTHORIZED
        }
      })
    }
  }

  async changePassword({ user_id, password }: { user_id: string; password: string }) {
    try {
      console.log({ user_id, password })

      await databaseServices.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            password: sha256(password)
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } catch (error) {
      errorMessage({
        error,
        errorDefault: {
          message: MESSAGE_ERROR.RESET_PASSWORD_TOKEN_REQUIRED,
          statusCode: STATUS_NAMING.UNAUTHORIZED
        }
      })
    }
  }
}

const authServices = new AuthServices()

export default authServices
