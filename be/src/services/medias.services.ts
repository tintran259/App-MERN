import fs from 'fs'
import { getNameImage, handleUploadSingleImage } from '~/utils/initFolder'
import sharp from 'sharp'
import { IMAGE_FOLDER_MAIN_DIR } from '~/constants/mediaFolder'
import path from 'path'
import { ErrorServices } from './error.services'
import { Request } from 'express'

class MediasServices {
  public async uploadSingleImage(req: Request) {
    try {
      const file = await handleUploadSingleImage(req)
      if (file) {
        const newFileImageAndDir = path.resolve(
          IMAGE_FOLDER_MAIN_DIR,
          // convert file name to jpg
          getNameImage(file.newFilename)
        )

        // file.filepath = '/uploads/temp/abc.jpg'
        // Create new image from '/upload/temp' and decrease quality and then new file in '/uploads' folder
        // increase image quality and new file name
        await sharp(file.filepath).jpeg({ quality: 80 }).toFile(newFileImageAndDir)

        // delete old image in  '/uploads/temp' folder
        fs.unlinkSync(file.filepath)

        return `http://localhost:3000/uploads/${getNameImage(file.newFilename)}`
      }
    } catch (error: any) {
      throw new ErrorServices({
        message: error?.message,
        statusCode: 500
      })
    }
  }
}

const mediasServices = new MediasServices()

export default mediasServices
