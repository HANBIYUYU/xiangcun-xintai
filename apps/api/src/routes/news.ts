import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const news = new Hono<{ Bindings: Env }>()

/** GET /api/news — 校地红旅合作新闻列表（按日期倒序） */
news.get('/', async (c) => {
  const db = c.env.DB
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 10), 1), 50)

  const rows = await db.prepare(
    'SELECT id, title, content, cover_url, date FROM news ORDER BY date DESC, id DESC LIMIT ?'
  ).bind(limit).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** POST /api/news — 新增动态（团队） */
news.post('/', authMiddleware, requireRole('team'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'INSERT INTO news (title, content, cover_url, date) VALUES (?, ?, ?, ?)'
  ).bind(title, String(b?.content ?? ''), String(b?.cover_url ?? ''), String(b?.date ?? '').slice(0, 10)).run()

  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/news/:id — 更新动态（团队） */
news.put('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'UPDATE news SET title = ?, content = ?, cover_url = ?, date = ? WHERE id = ?'
  ).bind(title, String(b?.content ?? ''), String(b?.cover_url ?? ''), String(b?.date ?? '').slice(0, 10), id).run()

  if (r.meta.changes === 0) return c.json({ error: '动态不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/news/:id — 删除动态（团队） */
news.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM news WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '动态不存在' }, 404)
  return c.json({ success: true, id })
})

export default news
