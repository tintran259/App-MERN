import { Router } from 'express'
// controller
import { uploadImagesController, uploadVideosController } from '~/controllers/medias.controller'
// validate
import { validateAccessToken } from '~/middlewares/common.middleware'
// others
import { asyncWrapper } from '~/utils/asyncWrapper'
import { validate } from '~/utils/validate'

const router = Router()

router.post('/upload-image', validate(validateAccessToken), asyncWrapper(uploadImagesController))

router.post('/upload-video', validate(validateAccessToken), asyncWrapper(uploadVideosController))

export default router
