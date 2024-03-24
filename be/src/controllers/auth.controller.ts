import { NextFunction, Request, Response } from 'express'
import authServices from '~/services/auth.services'
import { ParamsDictionary } from 'express-serve-static-core'
// types
import { IRegisterRequest, ILoginRequest } from '~/types/auth.type'

const loginControllerUser = async (req: Request<ParamsDictionary, any, ILoginRequest>, res: Response) => {
  const { user_id, info } = req.body
  const result = (await authServices.login({ user_id })) as Record<string, string>

  res.status(200).json({
    message: 'Login Success',
    data: {
      ...info,
      ...result
    }
  })
}

const registerControllerUser = async (req: Request<ParamsDictionary, any, IRegisterRequest>, res: Response) => {
  const { email, password, name, confirm_password, date_of_birth } = req.body
  const result = await authServices.register({ email, password, name, confirm_password, date_of_birth })

  res.status(200).json({ message: 'User created', data: result })
}

const logoutControllerUser = async (
  req: Request<ParamsDictionary, any, { user_id: string; refresh_token: string }>,
  res: Response
) => {
  await authServices.logout({
    refresh_token: req.body.refresh_token
  })

  res.status(200).json({ message: 'Logout Success' })
}

const emailVerifyController = async (
  req: Request<ParamsDictionary, any, { email_verify_token: string; user_id: string }>,
  res: Response
) => {
  await authServices.emailVerify({
    user_id: req.body.user_id
  })

  res.status(200).json({ message: 'Email verified' })
}

export { loginControllerUser, registerControllerUser, logoutControllerUser, emailVerifyController }
