import { Express } from 'express'

import UserModal from './models/user.model'

declare module 'express' {
  interface Request {}
}
