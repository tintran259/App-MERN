import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { EntityError, ErrorServices } from '~/services/error.services'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)
    // if no errors, continue
    if (errors.isEmpty()) {
      return next()
    }

    // define entityError
    const entityError = new EntityError({
      errors: {}
    })

    for (const key in errors.mapped()) {
      const msg = errors.mapped()[key].msg as ErrorServices
      if (msg && msg.statusCode !== STATUS_NAMING.UNPROCESSABLE_ENTITY) {
        return next(msg)
      } else {
        entityError.errors[key] = {
          ...errors.mapped()[key],
          msg: msg.message
        }
      }
    }
    next(entityError)
  }
}
