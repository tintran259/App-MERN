import { Router } from 'express'
// controllers
import { loginControllerUser, registerControllerUser } from '~/controllers/auth.controller'
// middleware
import { loginValidation, registerValidation } from '~/middlewares/auth.middleware'
// utils
import { validate } from '~/utils/validate'
import { asyncWrapper } from '~/utils/asyncWrapper'

const router = Router()

router.post('/login', validate(loginValidation), asyncWrapper(loginControllerUser))
router.post('/register', validate(registerValidation), asyncWrapper(registerControllerUser))

export default router
