import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userServices from '~/services/user.services'
import { VerifyStatus } from '~/types/auth.enum'
import { UpdateMeReqBody } from '~/types/user.type'

const getMeController = async (req: Request<ParamsDictionary, any, { user_id: string }>, res: Response) => {
  const result = await userServices.getMe({ user_id: req.body.user_id })
  res.status(200).json({ message: 'Get user success', data: result })
}

const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody & { user_id: string; decode_token: any }>,
  res: Response
) => {
  const payload = req.body
  const { user_id, decode_token, ...rest } = payload
  const result = await userServices.updateMe({
    user_id,
    payload: rest
  })

  res.status(200).json({ message: 'Update user success', data: result })
}
export { getMeController, updateMeController }
