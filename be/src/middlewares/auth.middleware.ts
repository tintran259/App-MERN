import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import authServices from '~/services/auth.services'
// others
import { ILoginRequest } from '~/types/auth.type'

const loginValidation = (
  req: {
    body: ILoginRequest
  } & Request,
  res: Response,
  next: NextFunction
) => {
  // Add validation logic here
  if (!req.body) {
    return res.status(400).json({ message: 'Invalid request' })
  }
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  next()
}

const registerValidation = checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Invalid email'
    },
    notEmpty: true,
    trim: true,
    custom: {
      options: async (value: string) => {
        const isExits = await authServices.checkEmailExit(value)
        if (isExits) {
          throw new Error('Email already exists')
        }
      }
    }
  },
  name: {
    notEmpty: true,
    isLength: {
      errorMessage: 'Name must be at least 3 characters long',
      options: { min: 3 }
    },
    trim: true
  },
  password: {
    isLength: {
      errorMessage: 'Password must be at least 6 characters long',
      options: { min: 6 }
    },
    notEmpty: true,
    trim: true,
    isStrongPassword: {
      errorMessage:
        'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
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
      errorMessage: 'Password must be at least 6 characters long',
      options: { min: 6 }
    },
    notEmpty: true,
    trim: true,
    isStrongPassword: {
      errorMessage:
        'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      }
    }
  },
  date_of_birth: {
    isDate: {
      errorMessage: 'Invalid date of birth'
    },
    notEmpty: true,
    trim: true
  }
})

export { loginValidation, registerValidation }
