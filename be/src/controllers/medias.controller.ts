import { Request, Response } from 'express'
// services
import mediasServices from '~/services/medias.services'

export const mediasController = async (req: Request, res: Response) => {
  const result = await mediasServices.uploadSingleImage(req)

  res.status(200).json({ message: 'Upload success', data: result })
}
