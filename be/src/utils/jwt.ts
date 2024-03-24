import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { MESSAGE_ERROR } from '~/constants/messageError'
import { STATUS_NAMING } from '~/constants/statusNaming'
import { ErrorServices } from '~/services/error.services'

type GenerateTokenTypes = {
  payload: string | object | Buffer
  secretOrPrivateKey: string
  options?: SignOptions
}

export const generateToken = ({
  payload,
  secretOrPrivateKey,
  options = {
    algorithm: 'HS256'
  }
}: GenerateTokenTypes) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
      if (err) {
        rejects(err)
      }
      resolve(token || '')
    })
  })
}

export const verifyToken = ({ token, secretOrPrivateKey }: { token: string; secretOrPrivateKey: string }) => {
  // return 1 promise
  return new Promise<jwt.JwtPayload>((resolve, rejects) => {
    jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
      if (err) {
        // token expired
        throw err
      }
      return resolve(decoded as jwt.JwtPayload)
    })
  })
}
