import { Hono } from 'hono'
import type { Env } from '../types'

const studyResults = new Hono<{ Bindings: Env }>()

/** GET /api/study-results — 研学成果展示（按时间倒序） */
studyResults.get('/', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT id, title, org_name, content, images, created_at FROM study_results ORDER BY id DESC'
  ).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

export default studyResults
