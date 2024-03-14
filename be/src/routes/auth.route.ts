import { Router } from 'express'
// controllers
import { loginFunc } from '~/controllers/auth.controller'
// middleware
import { loginValidation } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/login', loginValidation, loginFunc)

export default router
