import { Router } from 'express'
// controllers
import {
  emailVerifyController,
  loginControllerUser,
  logoutControllerUser,
  registerControllerUser,
  resendEmailVerifyController
} from '~/controllers/auth.controller'
// middleware
import {
  loginValidation,
  registerValidation,
  validateAccessToken,
  validateRefreshToken,
  validateMailToken
} from '~/middlewares/auth.middleware'
// utils
import { validate } from '~/utils/validate'
import { asyncWrapper } from '~/utils/asyncWrapper'

const router = Router()

/**
 * Description: Login
 * Route: POST /login
 * Permissions: public
 * Body: {email: string, password: string}
 */

router.post('/login', validate(loginValidation), asyncWrapper(loginControllerUser))

/**
 * Description: Register
 * Route: POST /register
 * Permissions: public
 * Body: {email: string, password: string, name: string, confirm_password: string, date_of_birth: string}
 */

router.post('/register', validate(registerValidation), asyncWrapper(registerControllerUser))

/**
 * Description: Logout
 * Route: POST /logout
 * Permissions: user
 * Header token: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
router.post(
  '/logout',
  validate(validateAccessToken),
  validate(validateRefreshToken),
  asyncWrapper(logoutControllerUser)
)

/**
 * Description: Email Verify
 * Route: POST /email-verify
 * Permissions: public
 * Body: {email_verify_token: string}
 */
router.post('/email-verify', validate(validateMailToken), asyncWrapper(emailVerifyController))

/**
 * Description: ReSend Email Verify
 * Route: POST /re-send-email-verify
 * Permissions: user
 * Header token: {Authorization: Bearer
 * <access_token>}
 */

router.post('/resend-email-verify', validate(validateAccessToken), asyncWrapper(resendEmailVerifyController))

export default router
