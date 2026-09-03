import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const suggestions = new Hono<{ Bindings: Env }>()

const CATEGORIES = ['修缮保护', '文旅开发', '宣传推广', '其他']
const STATUSES = ['待处理', '已归档', '已采纳']

function esc(v: unknown): string {
  const s = String(v ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** POST /api/suggestions — 游客建言，自动分类归档为待处理 */
suggestions.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: '请求格式错误' }, 400)

  const { title, category, content, contact } = body as {
    title?: string; category?: string; content?: string; contact?: string
  }
  if (!title?.trim() || !content?.trim()) {
    return c.json({ error: '标题与内容不能为空' }, 400)
  }
  if (category && !CATEGORIES.includes(category)) {
    return c.json({ error: '建言分类不正确' }, 400)
  }

  const result = await c.env.DB.prepare(
    'INSERT INTO suggestions (title, category, content, contact, status) VALUES (?, ?, ?, ?, ?)'
  ).bind(title.trim(), category || '其他', content.trim(), contact || '', '待处理').run()

  return c.json({ success: true, id: result.meta.last_row_id, status: '待处理' }, 201)
})

/** GET /api/suggestions — 列表（可按 status 过滤） */
suggestions.get('/', async (c) => {
  const db = c.env.DB
  const status = c.req.query('status')
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 50), 1), 100)

  const conds: string[] = []
  const args: (string | number)[] = []
  if (status) {
    conds.push('status = ?')
    args.push(status)
  }
  const where = conds.length ? ` WHERE ${conds.join(' AND ')}` : ''
  args.push(limit)

  const rows = await db.prepare(
    `SELECT id, title, category, content, contact, status, created_at FROM suggestions${where} ORDER BY id DESC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** GET /api/suggestions/export — 建言导出（Excel 兼容 CSV），供文旅局/党史办归档 */
suggestions.get('/export', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM suggestions ORDER BY status, id DESC').all()
  const header = ['编号', '标题', '分类', '内容', '联系方式', '状态', '提交时间']
  const lines = [
    header.join(','),
    ...rows.results.map((r: any) => [
      r.id, r.title, r.category, r.content, r.contact, r.status, r.created_at,
    ].map(esc).join(',')),
  ]
  c.header('Content-Type', 'text/csv; charset=utf-8')
  c.header('Content-Disposition', 'attachment; filename="suggestions.csv"')
  return c.body('\uFEFF' + lines.join('\r\n'))
})

/** PUT /api/suggestions/:id — 更新状态（待处理/已归档/已采纳） */
suggestions.put('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const body = await c.req.json().catch(() => null)
  const status = body?.status
  if (!STATUSES.includes(status)) {
    return c.json({ error: '状态不正确' }, 400)
  }

  const result = await c.env.DB.prepare('UPDATE suggestions SET status = ? WHERE id = ?')
    .bind(status, id).run()

  if (result.meta.changes === 0) return c.json({ error: '建言不存在' }, 404)
  return c.json({ success: true, id, status })
})

/** DELETE /api/suggestions/:id — 删除建言（团队/政企） */
suggestions.delete('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)
  const result = await c.env.DB.prepare('DELETE FROM suggestions WHERE id = ?').bind(id).run()
  if (result.meta.changes === 0) return c.json({ error: '建言不存在' }, 404)
  return c.json({ success: true, id })
})

export default suggestions
