// Must be set before any TLS connections (dev with Supabase pooler)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import authRouter from './routes/auth'
import meriKathaRouter from './routes/meriKathaRoutes'
import { swaggerSpec } from './config/swagger'

const app = express()
const PORT = process.env.PORT || 3001

const corsOrigin =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV !== 'production'
    ? /^http:\/\/localhost:\d+$/
    : 'http://localhost:5173')

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRouter)
app.use('/api', meriKathaRouter)

app.get('/', (_req, res) => {
  res.json({ success: true, data: { message: 'MannSathi API — Namaste 🙏' } })
})

app.listen(PORT, () => {
  console.log(`Server chaliraxa — port ${PORT}`)
})

export default app
