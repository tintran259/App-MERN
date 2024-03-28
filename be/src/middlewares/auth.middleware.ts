import { ObjectId } from 'mongodb'
import { ParamSchema, checkSchema } from 'express-validator'
import { STATUS_NAMING } from '~/constants/statusNaming'
import authServices from '~/services/auth.services'
import { ErrorServices } from '~/services/error.services'
import { MESSAGE_ERROR } from '~/constants/messageError'
import databaseServices from '~/services/database.services'
import { sha256 } from '~/utils/sha256'
import { verifyToken } from '~/utils/jwt'
import { errorMessage } from '~/utils/errorMessage'
import { validateAccessToken, nameSchema, dateOfBirthSchema } from './common.middleware'

const passwordSchema: ParamSchema = {
  isLength: {
    errorMessage: MESSAGE_ERROR.LENGTH_PASSWORD,
    options: { min: 6 }
  },
  notEmpty: true,
  trim: true,
  isStrongPassword: {
    errorMessage: MESSAGE_ERROR.STRONG_PASSWORD,
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  }
}

const confirmPasswordSchema: ParamSchema = {
  isLength: {
    errorMessage: MESSAGE_ERROR.LENGTH_PASSWORD,
    options: { min: 6 }
  },
  notEmpty: true,
  trim: true,
  isStrongPassword: {
    errorMessage: MESSAGE_ERROR.STRONG_PASSWORD,
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  },
  custom: {
    options: (value: string, { req }) => {
      if (value !== req.body.password) {
        throw new ErrorServices({
          message: MESSAGE_ERROR.PASSWORD_NOT_MATCH,
          statusCode: STATUS_NAMING.UNPROCESSABLE_ENTITY
        })
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      try {
        if (!value) {
          throw new ErrorServices({
            message: MESSAGE_ERROR.FORGOT_PASSWORD_TOKEN_REQUIRED,
            statusCode: STATUS_NAMING.UNAUTHORIZED
          })
        }

        const decode_forgot_password_token = await verifyToken({
          token: value,
          secretOrPrivateKey: process.env.JWT_SECRET_KEY_FORGOT_PASSWORD as string
        })

        if (!decode_forgot_password_token) {
          throw new ErrorServices({
            message: MESSAGE_ERROR.FORGOT_PASSWORD_TOKEN_REQUIRED,
            statusCode: STATUS_NAMING.UNAUTHORIZED
          })
        }

        // check user valid
        const { user_id } = decode_forgot_password_token

        const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

        if (!user) {
          throw new ErrorServices({
            message: MESSAGE_ERROR.USER_NOT_FOUND,
            statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
          })
        }

        req.body.user_id = user_id
      } catch (error) {
        errorMessage({
          error,
          errorDefault: {
            message: MESSAGE_ERROR.FORGOT_PASSWORD_TOKEN_REQUIRED,
            statusCode: STATUS_NAMING.UNAUTHORIZED
          }
        })
      }
    }
  }
}

const loginValidation = checkSchema(
  {
    email: {
      isEmail: {
        errorMessage: MESSAGE_ERROR.EMAIL_INVALID
      },
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const user = await databaseServices.users.findOne({
            email: value,
            password: sha256(req.body.password)
          })

          if (!user) {
            throw new ErrorServices({
              message: MESSAGE_ERROR.USER_NOT_FOUND,
              statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
            })
          }
          req.body.user_id = user._id.toString()
          req.body.info = user
        }
      }
    },
    password: {
      isLength: {
        errorMessage: MESSAGE_ERROR.LENGTH_PASSWORD,
        options: { min: 6 }
      },
      notEmpty: true,
      trim: true,
      isStrongPassword: {
        errorMessage: MESSAGE_ERROR.STRONG_PASSWORD,
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    }
  },
  // check in body request
  ['body']
)

const registerValidation = checkSchema(
  {
    email: {
      isEmail: {
        errorMessage: MESSAGE_ERROR.EMAIL_INVALID
      },
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value: string) => {
          const isExits = await authServices.checkEmailExit(value)
          if (isExits) {
            throw new ErrorServices({
              message: MESSAGE_ERROR.EMAIL_ALREADY_EXISTS,
              statusCode: STATUS_NAMING.UNPROCESSABLE_ENTITY
            })
          }
        }
      }
    },
    name: {
      ...nameSchema,
      notEmpty: true
    },
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: {
      ...dateOfBirthSchema,
      notEmpty: true
    }
  },
  // Check Body request
  ['body']
)

/**
 * check refresh token
 * 1. check refresh token valid
 * 2. check refresh token exits in database
 */
const validateRefreshToken = checkSchema(
  {
    refresh_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          try {
            if (!value) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.REFRESH_TOKEN_REQUIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }
            const [decode_refresh_token, infoRefreshToken] = await Promise.all([
              verifyToken({
                token: value,
                secretOrPrivateKey: process.env.JWT_SECRET_KEY_REFRESH_TOKEN as string
              }),
              databaseServices.refreshTokens.findOne({ refresh_token: value })
            ])
            if (!infoRefreshToken) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.REFRESH_TOKEN_NOT_FOUND,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }

            req.body.refresh_token = infoRefreshToken.refresh_token

            return true
          } catch (error) {
            errorMessage({
              error,
              errorDefault: {
                message: MESSAGE_ERROR.REFRESH_TOKEN_IS_INVALID_OR_EXPIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              }
            })
          }
        }
      }
    }
  },
  ['body']
)

/**
 * check email verify
 * 1: check email verify
 */

const validateMailToken = checkSchema(
  {
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          try {
            if (!value) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.EMAIL_VERIFY_TOKEN_REQUIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }

            const decode_email_verify_token = await verifyToken({
              token: value,
              secretOrPrivateKey: process.env.JWT_SECRET_KEY_EMAIL_VERIFY_TOKEN as string
            })

            if (!decode_email_verify_token) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.EMAIL_VERIFY_TOKEN_REQUIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }

            req.body.user_id = decode_email_verify_token.user_id
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
      }
    }
  },
  ['body']
)

/**
 * 1: check verify email
 * 2: check info user valid
 * 3: save token forgot password
 */

const validateMailForgotPassword = checkSchema(
  {
    email: {
      isEmail: {
        errorMessage: MESSAGE_ERROR.EMAIL_INVALID
      },
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const user = await databaseServices.users.findOne({ email: value })

          // check user valid
          if (!user) {
            throw new ErrorServices({
              message: MESSAGE_ERROR.USER_NOT_FOUND,
              statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
            })
          }

          // if user have forgot password token
          if (user.forgot_password_token) {
            throw new ErrorServices({
              message: MESSAGE_ERROR.FORGOT_PASSWORD_EXIT,
              statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
            })
          }

          req.body.user_id = user._id.toString()

          req.body.info = user
        }
      }
    }
  },
  ['body']
)

const validateForgotPasswordToken = checkSchema(
  {
    forgot_password_token: forgotPasswordTokenSchema
  },
  ['body']
)

const validateResetPassword = checkSchema(
  {
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    forgot_password_token: forgotPasswordTokenSchema
  },
  ['body']
)

export {
  loginValidation,
  registerValidation,
  validateAccessToken,
  validateRefreshToken,
  validateMailToken,
  validateMailForgotPassword,
  validateForgotPasswordToken,
  validateResetPassword
}
