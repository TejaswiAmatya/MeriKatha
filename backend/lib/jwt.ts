import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
const EXPIRES_IN = '30d'

export interface JwtPayload {
  sub: string   // User UUID
  email: string
}

export function signToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, SECRET, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
