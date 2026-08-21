import { Hono } from 'hono'
import type { Env } from '../types'

const studyPlans = new Hono<{ Bindings: Env }>()

/** GET /api/study-plans — 研学套餐列表（中小学思政 / 高校实践） */
studyPlans.get('/', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT id, title, type, schedule, courseware, teachers, cover_url FROM study_plans ORDER BY id ASC'
  ).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

export default studyPlans
