import { Request, Response } from 'express'
import authServices from '~/services/auth.services'
interface LoginRequest extends Request {
  // Add any additional properties specific to the login request
}

const loginFunc = async (req: LoginRequest, res: Response) => {
  res.send('Login')
}

const registerControllerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, confirm_password, date_of_birth } = req.body
    const result = await authServices.register({ email, password, name, confirm_password, date_of_birth })
    res.status(200).json({ message: 'User created', data: result })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

export { loginFunc, registerControllerUser }
