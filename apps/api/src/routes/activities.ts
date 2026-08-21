import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const activities = new Hono<{ Bindings: Env }>()

/** GET /api/activities — 活动预告列表（可按 status 过滤，按开始时间排序） */
activities.get('/', async (c) => {
  const db = c.env.DB
  const status = c.req.query('status')
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 20), 1), 50)

  const conds: string[] = []
  const args: (string | number)[] = []
  if (status) {
    conds.push('status = ?')
    args.push(status)
  }
  const where = conds.length ? ` WHERE ${conds.join(' AND ')}` : ''
  args.push(limit)

  const rows = await db.prepare(
    `SELECT id, title, type, place, start_time, end_time, status FROM activities${where} ORDER BY start_time ASC, id DESC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** POST /api/activities — 新增（团队/政企） */
activities.post('/', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'INSERT INTO activities (title, type, place, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(title, b?.type || '红色党课', String(b?.place ?? ''), String(b?.start_time ?? ''), String(b?.end_time ?? ''), b?.status || '报名中').run()
  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/activities/:id — 更新（团队/政企） */
activities.put('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'UPDATE activities SET title = ?, type = ?, place = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?'
  ).bind(title, b?.type || '红色党课', String(b?.place ?? ''), String(b?.start_time ?? ''), String(b?.end_time ?? ''), b?.status || '报名中', id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/activities/:id — 删除（团队/政企） */
activities.delete('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM activities WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

export default activities
