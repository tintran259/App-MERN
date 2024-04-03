import { handleUploadSingleImage } from '~/utils/initFolder'
import sharp from 'sharp'
import { IMAGE_FOLDER_MAIN_DIR } from '~/constants/mediaFolder'
import path from 'path'
import { ErrorServices } from './error.services'
import { errorMessage } from '~/utils/errorMessage'
import { Request } from 'express'

class MediasServices {
  public async uploadSingleImage(req: Request) {
    // eslint-disable-next-line no-useless-catch
    try {
      const file = await handleUploadSingleImage(req)
      if (file) {
        const newFileImageAndDir = path.resolve(
          IMAGE_FOLDER_MAIN_DIR,
          `${file.newFilename.substring(0, file.newFilename.lastIndexOf('.'))}.jpg`
        )
        sharp(file.filepath).jpeg({ quality: 80 }).toFile(newFileImageAndDir)
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
