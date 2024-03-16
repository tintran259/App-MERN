import { Request, Response } from 'express'
import authServices from '~/services/auth.services'
import { ParamsDictionary } from 'express-serve-static-core'
// types
import { IRegisterRequest } from '~/types/auth.type'

const loginFunc = async (req: Request, res: Response) => {
  res.send('Login')
}

const registerControllerUser = async (req: Request<ParamsDictionary, any, IRegisterRequest>, res: Response) => {
  const { email, password, name, confirm_password, date_of_birth } = req.body
  const result = await authServices.register({ email, password, name, confirm_password, date_of_birth })
  res.status(200).json({ message: 'User created', data: result })
}

export { loginFunc, registerControllerUser }
