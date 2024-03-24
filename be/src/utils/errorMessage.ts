import { JsonWebTokenError } from 'jsonwebtoken'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { ErrorServices } from '~/services/error.services'

const errorMessage = ({
  error,
  errorDefault
}: {
  error: unknown
  errorDefault?: {
    message: string
    statusCode: number
  }
}) => {
  function capitalizeFirstLetter(str: string) {
    return str.replace(/^\w/, (c) => c.toUpperCase())
  }
  switch (true) {
    case error instanceof ErrorServices:
      throw error
    case error instanceof JsonWebTokenError:
      throw new ErrorServices({
        message: capitalizeFirstLetter(error.message),
        statusCode: STATUS_NAMING.UNAUTHORIZED
      })
    default:
      throw errorDefault
  }
}

export { errorMessage }
