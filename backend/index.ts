import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import authRouter from './routes/auth'
import meriKathaRouter from './routes/meriKathaRoutes'
import circleRouter from './routes/circleRoutes'
import botRouter from './routes/bot'
import { requireAuth } from './middleware/auth'
import { swaggerSpec } from './config/swagger'

const app = express()
const PORT = process.env.PORT || 3001

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOrigin = configuredOrigins.length > 0
  ? configuredOrigins
  : (process.env.NODE_ENV !== 'production'
      ? /^http:\/\/localhost:\d+$/
      : 'http://localhost:5173')

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRouter)
app.use('/api', meriKathaRouter)
app.use('/api', circleRouter)
app.use('/api/bot', requireAuth, botRouter)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      data: null,
      error: 'Audio file dherai thulo chha. Ali sano recording try garnus.',
    })
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Request body invalid chha. Feri try garnus.',
    })
  }

  const status = typeof err?.status === 'number' ? err.status : 500
  const message = status >= 500
    ? 'Kei problem bhayo. Ali pachi feri try garnus.'
    : (err?.message || 'Request fail bhayo.')

  return res.status(status).json({ success: false, data: null, error: message })
})

app.get('/', (_req, res) => {
  res.json({ success: true, data: { message: 'MannSathi API — Namaste 🙏' } })
})

app.listen(PORT, () => {
  console.log(`Server chaliraxa — port ${PORT}`)
})

export default app
