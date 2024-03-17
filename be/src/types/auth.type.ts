import { VerifyStatus } from './auth.enum'

export type IRegisterRequest = {
  email: string
  password: string
  name: string
  confirm_password: string
  date_of_birth: Date
}

export type ILoginRequest = {
  email: string
  password: string
  user_id?: string
  info?: UserType
}

export interface UserType {
  name?: string

  email: string
  date_of_birth?: Date
  username?: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: VerifyStatus
  bio?: string
  location?: string
  website?: string
  avatar?: string
  cover_photo?: string
}
