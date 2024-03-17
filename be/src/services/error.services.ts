import { STATUS_NAMING } from '~/constants/statusNaming'
import { MESSAGE_ERROR } from '~/constants/messageError'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export class ErrorServices {
  message: string
  statusCode: number

  constructor({ message = '', statusCode = 0 }: { message: string; statusCode: number }) {
    this.message = message
    this.statusCode = statusCode
  }
}

export class EntityError extends ErrorServices {
  validates: ErrorType

  constructor({ message = MESSAGE_ERROR.UNPROCESSABLE_ENTITY, validates }: { message?: string; validates: ErrorType }) {
    super({ message, statusCode: STATUS_NAMING.UNPROCESSABLE_ENTITY })
    this.validates = validates
  }
}
