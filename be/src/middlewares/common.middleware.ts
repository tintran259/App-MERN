import { ParamSchema, checkSchema } from 'express-validator'
import { MESSAGE_ERROR } from '~/constants/messageError'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { ErrorServices } from '~/services/error.services'
import { errorMessage } from '~/utils/errorMessage'
import { verifyToken } from '~/utils/jwt'

const nameSchema: ParamSchema = {
  isLength: {
    errorMessage: MESSAGE_ERROR.NAME_LENGTH,
    options: { min: 3 }
  },
  trim: true
}

const dateOfBirthSchema: ParamSchema = {
  isDate: {
    errorMessage: MESSAGE_ERROR.DATE_INVALID
  },
  trim: true
}
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
            req.body.decode_token = decode_token
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

export { validateAccessToken, nameSchema, dateOfBirthSchema }
