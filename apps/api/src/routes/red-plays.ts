import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const redPlays = new Hono<{ Bindings: Env }>()

/** GET /api/red-plays — 红色戏曲/演出视频列表（可按 category 过滤） */
redPlays.get('/', async (c) => {
  const db = c.env.DB
  const category = c.req.query('category')
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 20), 1), 50)

  const conds: string[] = []
  const args: (string | number)[] = []
  if (category) {
    conds.push('category = ?')
    args.push(category)
  }
  const where = conds.length ? ` WHERE ${conds.join(' AND ')}` : ''
  args.push(limit)

  const rows = await db.prepare(
    `SELECT id, title, category, iframe_src, cover_url, sort_order FROM red_plays${where} ORDER BY sort_order ASC, id ASC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** POST /api/red-plays — 新增（团队） */
redPlays.post('/', authMiddleware, requireRole('team'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)
  const category = b?.category || '折子戏'
  if (!['折子戏', '演出视频'].includes(category)) return c.json({ error: '分类不正确' }, 400)

  const r = await c.env.DB.prepare(
    'INSERT INTO red_plays (title, category, iframe_src, cover_url, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).bind(title, category, String(b?.iframe_src ?? ''), String(b?.cover_url ?? ''), Number(b?.sort_order || 0)).run()
  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/red-plays/:id — 更新（团队） */
redPlays.put('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  if (!title) return c.json({ error: '标题不能为空' }, 400)

  const r = await c.env.DB.prepare(
    'UPDATE red_plays SET title = ?, category = ?, iframe_src = ?, cover_url = ?, sort_order = ? WHERE id = ?'
  ).bind(title, b?.category || '折子戏', String(b?.iframe_src ?? ''), String(b?.cover_url ?? ''), Number(b?.sort_order || 0), id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/red-plays/:id — 删除（团队） */
redPlays.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM red_plays WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '内容不存在' }, 404)
  return c.json({ success: true, id })
})

export default redPlays
