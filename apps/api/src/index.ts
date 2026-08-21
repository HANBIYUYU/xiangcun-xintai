import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Env } from './types'
import authRoutes from './routes/auth'
import stageRoutes from './routes/stages'
import redPlayRoutes from './routes/red-plays'
import articleRoutes from './routes/articles'
import activityRoutes from './routes/activities'
import submissionRoutes from './routes/submissions'
import suggestionRoutes from './routes/suggestions'
import quizRoutes from './routes/quiz'
import bookingRoutes from './routes/bookings'
import studyPlanRoutes from './routes/study-plans'
import studyResultRoutes from './routes/study-results'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import faqRoutes from './routes/faq'
import newsRoutes from './routes/news'
import statsRoutes from './routes/stats'
import uploadRoutes from './routes/upload'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({
  origin: [
    'http://localhost:5173',
    'https://xiangcun-xintai.pages.dev',
  ],
  credentials: true,
}))

app.get('/', (c) => c.json({
  name: 'xiangcun-xintai-api',
  message: '湘村新台 API',
  version: '1.0.0',
  status: 'running',
}))

app.route('/api/auth', authRoutes)
app.route('/api/stages', stageRoutes)
app.route('/api/red-plays', redPlayRoutes)
app.route('/api/articles', articleRoutes)
app.route('/api/activities', activityRoutes)
app.route('/api/submissions', submissionRoutes)
app.route('/api/suggestions', suggestionRoutes)
app.route('/api/quiz', quizRoutes)
app.route('/api/bookings', bookingRoutes)
app.route('/api/study-plans', studyPlanRoutes)
app.route('/api/study-results', studyResultRoutes)
app.route('/api/products', productRoutes)
app.route('/api/orders', orderRoutes)
app.route('/api/faq', faqRoutes)
app.route('/api/news', newsRoutes)
app.route('/api/stats', statsRoutes)
app.route('/api/upload', uploadRoutes)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

export default app
