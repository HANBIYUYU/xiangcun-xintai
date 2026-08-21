import { Hono } from 'hono'
import type { Env } from '../types'

const articles = new Hono<{ Bindings: Env }>()

/** GET /api/articles — 互动阅读列表（按 sort_order 排序） */
articles.get('/', async (c) => {
  const db = c.env.DB
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 20), 1), 50)

  const rows = await db.prepare(
    'SELECT id, title, content, cover_url, source, sort_order, created_at FROM articles ORDER BY sort_order ASC, id DESC LIMIT ?'
  ).bind(limit).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

export default articles
