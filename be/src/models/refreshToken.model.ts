import { RefreshTokenType } from '~/types/auth.type'

export default class RefreshTokenModel {
  user_id: string
  refresh_token: string

  constructor(refreshToken: RefreshTokenType) {
    this.user_id = refreshToken.user_id
    this.refresh_token = refreshToken.refresh_token
  }
}
