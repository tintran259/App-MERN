import { Router } from 'express'
// controller
import { mediasController } from '~/controllers/medias.controller'
// validate
import { validateAccessToken } from '~/middlewares/common.middleware'
// others
import { asyncWrapper } from '~/utils/asyncWrapper'
import { validate } from '~/utils/validate'

const router = Router()

router.post('/upload-image', validate(validateAccessToken), asyncWrapper(mediasController))

export default router
