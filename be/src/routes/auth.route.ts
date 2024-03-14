import { Router } from 'express'
// controllers
import { loginFunc } from '~/controllers/auth.controller'

const router = Router()

router.get('/login', loginFunc)

export default router
