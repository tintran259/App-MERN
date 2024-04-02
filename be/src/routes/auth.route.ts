import { Router } from 'express'
// controllers
import {
  emailVerifyController,
  forgotPasswordController,
  loginControllerUser,
  logoutControllerUser,
  registerControllerUser,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  changePasswordController
} from '~/controllers/auth.controller'
// middleware
import {
  loginValidation,
  registerValidation,
  validateAccessToken,
  validateRefreshToken,
  validateMailToken,
  validateMailForgotPassword,
  validateForgotPasswordToken,
  validateResetPassword,
  changePasswordValidator
} from '~/middlewares/auth.middleware'
import { verifyUserValidator } from '~/middlewares/user.middleware'
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

/**
 * Description: Forgot Password
 * Route: POST /forgot-password
 * Permissions: public
 * Header token: {Authorization: Bearer <access_token>}
 */

router.post('/forgot-password', validate(validateMailForgotPassword), asyncWrapper(forgotPasswordController))

/**
 * Description: Verify Forgot Password
 * Route: Post /verify-forgot-password
 * Body {forgot_password_token: string}
 */

router.post(
  '/verify-forgot-password',
  validate(validateForgotPasswordToken),
  asyncWrapper(verifyForgotPasswordTokenController)
)

/**
 * Description: Reset Password
 * Route: POST /reset-password
 * Permissions: public
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */

router.post('/reset-password', validate(validateResetPassword), asyncWrapper(resetPasswordController))

/**
 * Description: Change Password
 * Route: PUT /change-password
 */

router.put(
  '/change-password',
  validate(validateAccessToken),
  verifyUserValidator,
  validate(changePasswordValidator),
  asyncWrapper(changePasswordController)
)

export default router
