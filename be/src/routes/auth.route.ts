import { Router } from 'express'
// controllers
import { loginFunc, registerControllerUser } from '~/controllers/auth.controller'
// middleware
import { loginValidation, registerValidation } from '~/middlewares/auth.middleware'
// utils
import { validate } from '~/utils/validate'

const router = Router()

router.post('/login', loginValidation, loginFunc)
router.post('/register', validate(registerValidation), registerControllerUser)

export default router
