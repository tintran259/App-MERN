import { Request, Response } from 'express'
import path from 'path'
import { IMAGE_FOLDER_MAIN_DIR, VIDEO_FOLDER_DIR } from '~/constants/mediaFolder'
// services
import mediasServices from '~/services/medias.services'

export const uploadImagesController = async (req: Request, res: Response) => {
  const result = await mediasServices.uploadImage(req)

  res.status(200).json({ message: 'Upload Image success', data: result })
}

export const uploadVideosController = async (req: Request, res: Response) => {
  const result = await mediasServices.uploadVideo(req)

  res.status(200).json({ message: 'Upload Video success', data: result })
}

// Static file
export const serveImageController = async (req: Request, res: Response) => {
  const { nameFile } = req.params

  if (nameFile.includes('.MOV') || nameFile.includes('.mp4')) {
    console.log('Runn case', path.resolve(VIDEO_FOLDER_DIR, nameFile))

    return res.sendFile(path.resolve(VIDEO_FOLDER_DIR, nameFile), (err) => {
      if (err) {
        console.log('err:', err)

        res.status(404).send('File not found')
      }
    })
  } else {
    return res.sendFile(path.resolve(IMAGE_FOLDER_MAIN_DIR, nameFile), (err) => {
      if (err) {
        res.status(404).send('File not found')
      }
    })
  }
}
