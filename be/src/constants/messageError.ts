const MESSAGE_ERROR = {
  // Status
  SUCCESS: 'Success',
  NOT_FOUND: 'Not Found',
  BAD_REQUEST: 'Bad Request',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  // Validation
  NOT_IMPLEMENTED: 'Not Implemented',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  LENGTH_PASSWORD: 'Password must be at least 6 characters long',
  PASSWORD_NOT_MATCH: 'Password and confirm password are not match',
  STRONG_PASSWORD:
    'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  NAME_LENGTH: 'Name must be at least 3 characters long',
  DATE_INVALID: 'Date is invalid',
  // Authentication
  UNAUTHORIZED: 'Unauthorized',
  USER_NOT_FOUND: 'User not found',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_NOT_FOUND: 'Access token not found',
  ACCESS_TOKEN_EXPIRED_IN_VALID: 'Access token is expired or invalid',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',
  REFRESH_TOKEN_IS_INVALID_OR_EXPIRED: 'Refresh token is invalid or expired',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  // Verify email
  EMAIL_INVALID: 'Email is invalid',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_VERIFY_TOKEN_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFIED: 'Email verified',
  EMAIL_VERIFIED_BEFORE: 'Email verified before',
  // Forgot Password
  FORGOT_PASSWORD_EXIT: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_REQUIRED: 'Forgot password token is required',
  // Reset Password
  RESET_PASSWORD_SUCCESS: 'Password reset success',
  RESET_PASSWORD_TOKEN_REQUIRED: 'Reset password token is required',
  // User
  USER_NOT_VERIFIED: 'User not verified',
  BIO_LENGTH: 'Bio must be at most 255 characters long',
  USERNAME_LENGTH: 'Username must be at least 3 characters long and at most 10 characters long',
  COVER_PHOTO_INVALID: 'Cover photo is invalid',
  AVATAR_INVALID: 'Avatar is invalid',
  FOLLOWER_BY_YOURSELF: 'You can not follow yourself',
  FOLLOWER_USER_ID_REQUIRED: 'Follower user id is required',
  PASSWORD_IS_NOT_MATCH: 'Password is not match with current password',
  PASSWORD_REQUIRED: 'Password is required'
}

export { MESSAGE_ERROR }
