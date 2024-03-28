import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ParamsDictionary } from 'express-serve-static-core'
import { VerifyStatus } from '~/types/auth.enum'
import { ErrorServices } from '~/services/error.services'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { MESSAGE_ERROR } from '~/constants/messageError'
import { dateOfBirthSchema, nameSchema } from '~/middlewares/common.middleware'
/**
 * check verify user
 */

const verifyUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { verify } = req.body.decode_token
    if (verify === VerifyStatus.unverified) {
      new ErrorServices({
        message: MESSAGE_ERROR.USER_NOT_VERIFIED,
        statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
      })
    }
    next()
  } catch (error) {
    next(
      new ErrorServices({
        message: MESSAGE_ERROR.USER_NOT_VERIFIED,
        statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
      })
    )
  }
}

/**
 * Update User Info
 *  - name
 * - date_of_birth
 *
 */

const updateMeValidator = checkSchema(
  {
    name: {
      ...nameSchema,
      optional: true
    },
    date_of_birth: {
      ...dateOfBirthSchema,
      optional: true
    },
    bio: {
      trim: true,
      optional: true,
      isLength: {
        errorMessage: MESSAGE_ERROR.BIO_LENGTH,
        options: { max: 255 }
      }
    },
    location: {
      optional: true
    },
    website: {
      optional: true
    },
    username: {
      optional: true,
      isLength: {
        errorMessage: MESSAGE_ERROR.USERNAME_LENGTH,
        options: { min: 3, max: 10 }
      }
    },
    cover_photo: {
      optional: true,
      isString: {
        errorMessage: MESSAGE_ERROR.COVER_PHOTO_INVALID
      }
    },
    avatar: {
      optional: true,
      isString: {
        errorMessage: MESSAGE_ERROR.AVATAR_INVALID
      }
    }
  },
  ['body']
)

export { verifyUserValidator, updateMeValidator }
