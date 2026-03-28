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

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
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
