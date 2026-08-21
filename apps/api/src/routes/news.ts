import { Hono } from 'hono'
import type { Env } from '../types'

const news = new Hono<{ Bindings: Env }>()

/** GET /api/news — 校地红旅合作新闻列表（按日期倒序） */
news.get('/', async (c) => {
  const db = c.env.DB
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 10), 1), 50)

  const rows = await db.prepare(
    'SELECT id, title, cover_url, date FROM news ORDER BY date DESC, id DESC LIMIT ?'
  ).bind(limit).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

export default news
