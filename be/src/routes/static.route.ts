import Route from 'express'
import { serveImageController } from '~/controllers/medias.controller'
import { asyncWrapper } from '~/utils/asyncWrapper'

const router = Route()

router.get('/:nameFile', asyncWrapper(serveImageController))

export default router
