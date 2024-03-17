import { checkSchema } from 'express-validator'
import { STATUS_NAMING } from '~/constants/statusNaming'
import authServices from '~/services/auth.services'
import { ErrorServices } from '~/services/error.services'
import { MESSAGE_ERROR } from '~/constants/messageError'
import databaseServices from '~/services/database.services'
import { sha256 } from '~/utils/sha256'

const loginValidation = checkSchema({
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
})

const registerValidation = checkSchema({
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
})

export { loginValidation, registerValidation }
