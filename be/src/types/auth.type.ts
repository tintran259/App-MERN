import { Request } from 'express'

export type ILoginRequest = {
  // Add any additional properties specific to the login request
  email: string
  password: string
}
