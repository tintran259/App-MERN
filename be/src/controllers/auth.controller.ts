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

const resendEmailVerifyController = async (req: Request<ParamsDictionary, any, { user_id: string }>, res: Response) => {
  await authServices.resendEmailVerify({ user_id: req.body.user_id })

  res.status(200).json({ message: 'Email sent' })
}

const forgotPasswordController = async (req: Request<ParamsDictionary, any, { user_id: string }>, res: Response) => {
  const result = await authServices.forgotPassword({ user_id: req.body.user_id })

  res.status(200).json({ message: 'Email forgot password sent', data: result })
}

const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, { user_id: string }>,
  res: Response
) => {
  res.status(200).json({ message: 'Email forgot password verified' })
}

const resetPasswordController = async (
  req: Request<ParamsDictionary, any, { user_id: string; password: string }>,
  res: Response
) => {
  await authServices.resetPassword({ user_id: req.body.user_id, password: req.body.password })

  res.status(200).json({ message: 'Password reset success' })
}

export {
  loginControllerUser,
  registerControllerUser,
  logoutControllerUser,
  emailVerifyController,
  resendEmailVerifyController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController
}
