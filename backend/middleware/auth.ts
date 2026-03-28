import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ success: false, data: null, error: 'Login garnus pehile.' })
  }
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ success: false, data: null, error: 'Session puraan bhayo. Feri login garnus.' })
  }
}
