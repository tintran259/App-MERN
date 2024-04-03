import fs from 'fs'
import path from 'path'
import { Request } from 'express'
import { ErrorServices } from '~/services/error.services'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { IMAGE_FOLDER_DIR } from '~/constants/mediaFolder'
import { File } from 'formidable'

export const initFolder = () => {
  if (!fs.existsSync(IMAGE_FOLDER_DIR)) {
    fs.mkdirSync(IMAGE_FOLDER_DIR, {
      recursive: true
    })
  }
}

export const handleUploadSingleImage = async (req: Request): Promise<File> => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: IMAGE_FOLDER_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300kb,
    filter: ({ name, mimetype }) => {
      const isValidImage = Boolean(mimetype?.match(/^image/))
      if (!isValidImage) {
        form.emit('error' as any, new Error('File type is not supported') as any)
        return false
      }
      return true
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (Object.keys(files).length === 0) {
        reject(
          new ErrorServices({
            message: 'No file uploaded',
            statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
          })
        )
      } else {
        resolve((files.image as File[])[0])
      }
      if (err) {
        reject(
          new ErrorServices({
            message: err.message,
            statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
          })
        )
      }
    })
  })
}
