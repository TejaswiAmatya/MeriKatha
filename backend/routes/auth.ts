import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { signup, login, logout, me } from '../controller/auth.controller'
import { requireAuth } from '../middleware/auth'

const router = Router()

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ success: false, data: null, error: result.error.message })
    }
    next()
  }
}

router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
