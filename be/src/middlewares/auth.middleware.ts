import { checkSchema } from 'express-validator'
import { STATUS_NAMING } from '~/constants/statusNaming'
import authServices from '~/services/auth.services'
import { ErrorServices } from '~/services/error.services'
import { MESSAGE_ERROR } from '~/constants/messageError'
import databaseServices from '~/services/database.services'
import { sha256 } from '~/utils/sha256'
import { verifyToken } from '~/utils/jwt'
import { errorMessage } from '~/utils/errorMessage'

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
      notEmpty: true,
      isLength: {
        errorMessage: MESSAGE_ERROR.NAME_LENGTH,
        options: { min: 3 }
      },
      trim: true
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
    },
    confirm_password: {
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
    },
    date_of_birth: {
      isDate: {
        errorMessage: MESSAGE_ERROR.DATE_INVALID
      },
      notEmpty: true,
      trim: true
    }
  },
  // Check Body request
  ['body']
)

/**
 * check access token
 * 1. check access token valid
 * 2. check access token exits in database
 */
const validateAccessToken = checkSchema(
  {
    Authorization: {
      custom: {
        options: async (value: string, { req }) => {
          try {
            if (!value) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.ACCESS_TOKEN_REQUIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }
            const access_token = value.split(' ')[1] // "Bearer <access_token>" => get token after Bearer
            // if not exits token
            if (!access_token) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.ACCESS_TOKEN_REQUIRED,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }
            // verify token
            const decode_token = await verifyToken({
              token: access_token,
              secretOrPrivateKey: process.env.JWT_SECRET_KEY_ACCESS_TOKEN as string
            })
            // if token valid => decode token => info user in payload token
            if (!decode_token) {
              throw new ErrorServices({
                message: MESSAGE_ERROR.ACCESS_TOKEN_NOT_FOUND,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              })
            }
            // get user_id in payload token
            const user_id = decode_token.user_id
            req.body.user_id = user_id
            return true // next step
          } catch (error) {
            errorMessage({
              error,
              errorDefault: {
                message: MESSAGE_ERROR.ACCESS_TOKEN_EXPIRED_IN_VALID,
                statusCode: STATUS_NAMING.UNAUTHORIZED
              }
            })
          }
        }
      }
    }
  },
  ['headers']
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

const validateMailToken = checkSchema({
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
})

export { loginValidation, registerValidation, validateAccessToken, validateRefreshToken, validateMailToken }
