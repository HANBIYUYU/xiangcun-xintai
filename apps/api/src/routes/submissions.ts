import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const submissions = new Hono<{ Bindings: Env }>()

/** POST /api/submissions — 游客提交红色记忆（老照片/口述/短视频），默认待审核 */
submissions.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: '请求格式错误' }, 400)

  const { author_name, contact, type, content, media_url } = body as {
    author_name?: string; contact?: string; type?: string; content?: string; media_url?: string
  }
  if (!author_name?.trim() || !content?.trim()) {
    return c.json({ error: '姓名与内容不能为空' }, 400)
  }
  if (type && !['老照片', '口述', '短视频'].includes(type)) {
    return c.json({ error: '投稿类型不正确' }, 400)
  }

  const result = await c.env.DB.prepare(
    'INSERT INTO submissions (author_name, contact, type, content, media_url, status) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(author_name.trim(), contact || '', type || '老照片', content.trim(), media_url || '', '待审核').run()

  return c.json({ success: true, id: result.meta.last_row_id, status: '待审核' }, 201)
})

/** GET /api/submissions — 列表：公开页传 status=已通过；后台不带参查全部 */
submissions.get('/', async (c) => {
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
    `SELECT id, author_name, type, content, media_url, status, created_at FROM submissions${where} ORDER BY id DESC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** PUT /api/submissions/:id/review — 团队审核：已通过 / 已驳回 */
submissions.put('/:id/review', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const body = await c.req.json().catch(() => null)
  const status = body?.status
  if (!['已通过', '已驳回'].includes(status)) {
    return c.json({ error: '审核状态不正确' }, 400)
  }

  const result = await c.env.DB.prepare('UPDATE submissions SET status = ? WHERE id = ?')
    .bind(status, id).run()

  if (result.meta.changes === 0) return c.json({ error: '投稿不存在' }, 404)
  return c.json({ success: true, id, status })
})

/** DELETE /api/submissions/:id — 删除投稿（团队；清数据/违规处理） */
submissions.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)
  const result = await c.env.DB.prepare('DELETE FROM submissions WHERE id = ?').bind(id).run()
  if (result.meta.changes === 0) return c.json({ error: '投稿不存在' }, 404)
  return c.json({ success: true, id })
})

export default submissions
