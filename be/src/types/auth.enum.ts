export enum VerifyStatus {
  unverified = 0,
  verified = 1,
  banned = -1
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
  ForgotPasswordToken
}
