import fs from 'fs'
import { Request } from 'express'
import { ErrorServices } from '~/services/error.services'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { IMAGE_FOLDER_DIR, VIDEO_FOLDER_DIR } from '~/constants/mediaFolder'
import { File } from 'formidable'

export const initFolder = () => {
  ;[IMAGE_FOLDER_DIR, VIDEO_FOLDER_DIR].forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true
      })
    }
  })
}

export const handleUploadImage = async (req: Request): Promise<File[]> => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: IMAGE_FOLDER_DIR,
    maxFiles: 10,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300kb,
    maxTotalFileSize: 10 * 1024 * 1024, // 10mb
    filter: ({ name, mimetype }) => {
      const isValidImage = Boolean(mimetype?.match(/^image/))
      if (!isValidImage) {
        form.emit('error' as any, new Error('File type is not supported') as any)
        return false
      }
      return true
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (Object.keys(files).length === 0) {
        reject(
          new ErrorServices({
            message: 'No file uploaded',
            statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
          })
        )
      } else {
        resolve(files.image as File[])
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

export const handleUploadVideo = async (req: Request): Promise<File[]> => {
  const formidable = (await import('formidable')).default

  const form = formidable({
    uploadDir: VIDEO_FOLDER_DIR,
    maxFiles: 10,
    keepExtensions: true,
    maxFileSize: 1024 * 1024 * 50, // 50mb,
    maxTotalFileSize: 1024 * 1024 * 100, // 100mb
    filter: ({ name, mimetype }) => {
      const isValidVideo =
        (name === 'video' && Boolean(mimetype?.match(/^video/))) || Boolean(mimetype?.includes('mp4'))
      if (!isValidVideo) {
        form.emit('error' as any, new Error('File type is not supported') as any)
        return false
      }
      return true
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (Object.keys(files).length === 0) {
        reject(
          new ErrorServices({
            message: 'No file uploaded',
            statusCode: STATUS_NAMING.INTERNAL_SERVER_ERROR
          })
        )
      } else {
        resolve(files.video as File[])
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

export const getNameImage = (filename: string) => {
  return `${filename.substring(0, filename.lastIndexOf('.'))}.jpg`
}

export const getNameVideo = (filename: string) => {
  return `${filename.substring(0, filename.lastIndexOf('.'))}.MOV`
}
