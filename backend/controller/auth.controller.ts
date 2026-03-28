import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, data: null, error: 'Yo email already chha. Login garnus?' })
    }
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, passwordHash } })
    const token = signToken(user.id, user.email)
    res.cookie('token', token, COOKIE_OPTIONS)
    return res.status(201).json({ success: true, data: { userId: user.id, email: user.email } })
  } catch {
    return res.status(500).json({ success: false, data: null, error: 'Kei problem bhayo. Ali pachi try garnus.' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    const valid = user && await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ success: false, data: null, error: 'Email ya password milएन.' })
    }
    const token = signToken(user.id, user.email)
    res.cookie('token', token, COOKIE_OPTIONS)
    return res.json({ success: true, data: { userId: user.id, email: user.email } })
  } catch {
    return res.status(500).json({ success: false, data: null, error: 'Kei problem bhayo. Ali pachi try garnus.' })
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token')
  return res.json({ success: true, data: null })
}

export function me(req: Request, res: Response) {
  return res.json({ success: true, data: { userId: req.user!.sub, email: req.user!.email } })
}
