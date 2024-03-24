import { Request, Response, NextFunction } from 'express'

export const asyncWrapper = (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      console.log('Error: ', error)

      next(error)
    }
  }
}
