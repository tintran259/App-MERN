import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { Request } from 'express'
import { getNameImage, getNameVideo, handleUploadImage, handleUploadVideo } from '~/utils/initFolder'
import { IMAGE_FOLDER_MAIN_DIR, VIDEO_FOLDER_DIR } from '~/constants/mediaFolder'
import { ErrorServices } from './error.services'
import { isDev } from '~/constants/config'
import { config } from 'dotenv'
import { MediaEnum } from '~/types/media.enum'

config()

class MediasServices {
  public async uploadImage(req: Request) {
    try {
      const files = await handleUploadImage(req)
      const result = Promise.all(
        files.map(async (file) => {
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

            return {
              url: isDev
                ? `http://localhost:${process.env.PORT}/uploads/${getNameImage(file.newFilename)}`
                : `${process.env.HOST}/uploads/${getNameImage(file.newFilename)}`,
              type: MediaEnum.Image
            }
          }
        })
      )

      return result
    } catch (error: any) {
      throw new ErrorServices({
        message: error?.message,
        statusCode: 500
      })
    }
  }

  public async uploadVideo(req: Request) {
    try {
      const files = await handleUploadVideo(req)
      const result = Promise.all(
        files.map(async (file) => {
          if (file) {
            return {
              url: isDev
                ? `http://localhost:${process.env.PORT}/uploads/${getNameVideo(file.newFilename)}`
                : `${process.env.HOST}/uploads/${getNameVideo(file.newFilename)}`,
              type: MediaEnum.Video
            }
          }
        })
      )

      return result
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
