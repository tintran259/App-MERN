import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userServices from '~/services/user.services'

const getMeController = async (req: Request<ParamsDictionary, any, { user_id: string }>, res: Response) => {
  const result = await userServices.getMe({ user_id: req.body.user_id })
  res.status(200).json({ message: 'Get user success', data: result })
}

export { getMeController }
