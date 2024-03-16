import { Request, Response } from 'express'

const getUser = async (req: Request, res: Response) => {
  res.send('users')
}

export { getUser }
