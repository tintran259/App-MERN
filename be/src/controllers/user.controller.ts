import { Request, Response } from 'express'

interface UserRequest extends Request {
  // Add any additional properties specific to the login request
}

const getUser = async (req: UserRequest, res: Response) => {
  res.send('Users')
}

export { getUser }
