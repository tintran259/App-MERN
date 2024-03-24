const MESSAGE_ERROR = {
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NOT_IMPLEMENTED: 'Not Implemented',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_INVALID: 'Email is invalid',
  LENGTH_PASSWORD: 'Password must be at least 6 characters long',
  STRONG_PASSWORD:
    'Password must be at least 6 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  PASSWORD_NOT_MATCH: 'Password and confirm password are not match',
  NAME_LENGTH: 'Name must be at least 3 characters long',
  DATE_INVALID: 'Date is invalid',
  USER_NOT_FOUND: 'User not found',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_EXPIRED_IN_VALID: 'Access token is expired or invalid',
  REFRESH_TOKEN_IS_INVALID_OR_EXPIRED: 'Refresh token is invalid or expired'
}

export { MESSAGE_ERROR }
