import jwt, { Secret, SignOptions } from 'jsonwebtoken'

type GenerateTokenTypes = {
  payload: string | object | Buffer
  secretOrPrivateKey?: string
  options?: SignOptions
}

export const generateToken = ({
  payload,
  secretOrPrivateKey = process.env.JWT_SECRET_KEY as string,
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
