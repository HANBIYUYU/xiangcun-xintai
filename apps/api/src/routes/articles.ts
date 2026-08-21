import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

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

/** POST /api/articles — 新增（团队） */
articles.post('/', authMiddleware, requireRole('team'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'INSERT INTO articles (title, content, cover_url, source, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).bind(title, String(b?.content ?? ''), String(b?.cover_url ?? ''), String(b?.source ?? ''), Number(b?.sort_order || 0)).run()
  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/articles/:id — 更新（团队） */
articles.put('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'UPDATE articles SET title = ?, content = ?, cover_url = ?, source = ?, sort_order = ? WHERE id = ?'
  ).bind(title, String(b?.content ?? ''), String(b?.cover_url ?? ''), String(b?.source ?? ''), Number(b?.sort_order || 0), id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/articles/:id — 删除（团队） */
articles.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

export default articles
