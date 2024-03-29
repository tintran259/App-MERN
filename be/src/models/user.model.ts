import { UserType } from '~/types/auth.type'
import { VerifyStatus } from '~/types/auth.enum'
import { ObjectId } from 'mongodb'
export default class UserModal {
  _id: ObjectId
  name: string

  email: string
  date_of_birth: Date
  username: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: VerifyStatus
  bio: string
  location: string
  website: string
  avatar: string
  cover_photo: string

  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.username = user.username || ''
    this.password = user.password
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || VerifyStatus.unverified
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}
