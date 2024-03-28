import { Router } from 'express'
// controllers
import { getMeController } from '~/controllers/user.controller'
import { updateMeController } from '~/controllers/user.controller'
// middleware
import { validate } from '~/utils/validate'
import { validateAccessToken } from '~/middlewares/common.middleware'
import { verifyUserValidator, updateMeValidator } from '~/middlewares/user.middleware'

const router = Router()

/**
 * Description: Get me
 * Route: GET /get-me
 * Permissions: user
 * Header token: {Authorization: Bearer}
 */
router.get('/get-me', validate(validateAccessToken), getMeController)

/**
 * Description: Update me
 * Route: PATCH /update-me
 * Permissions: user
 * Header token: {Authorization: Bearer}
 * Body: {...}
 */

router.patch(
  '/update-me',
  validate(validateAccessToken),
  verifyUserValidator,
  validate(updateMeValidator),
  updateMeController
)

export default router
