import { NextFunction, Request, Response } from 'express'
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
    return res.status(400).json({ message: 'Invalid request' }) 123
  }
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  next()
}

export { loginValidation }
