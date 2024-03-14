import { Request, Response } from 'express'

interface LoginRequest extends Request {
  // Add any additional properties specific to the login request
}

const loginFunc = async (req: LoginRequest, res: Response) => {
  res.send('Login')
}

export { loginFunc }
