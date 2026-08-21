import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const bookings = new Hono<{ Bindings: Env }>()

/** POST /api/bookings — 游客团体预约研学，生成预约单（待确认） */
bookings.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: '请求格式错误' }, 400)

  const { org_name, contact, plan_type, people_count, duration, target_stage, note } = body as {
    org_name?: string; contact?: string; plan_type?: string; people_count?: number
    duration?: string; target_stage?: string; note?: string
  }

  if (!org_name?.trim()) return c.json({ error: '请填写组织/单位名称' }, 400)
  if (!contact?.trim()) return c.json({ error: '请填写联系方式' }, 400)
  const count = Number(people_count)
  if (!Number.isInteger(count) || count <= 0 || count > 10000) {
    return c.json({ error: '人数需为 1-10000 的整数' }, 400)
  }
  if (plan_type && !['中小学思政', '高校实践'].includes(plan_type)) {
    return c.json({ error: '套餐类型不正确' }, 400)
  }

  const result = await c.env.DB.prepare(
    'INSERT INTO bookings (org_name, contact, plan_type, people_count, duration, target_stage, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(org_name.trim(), contact.trim(), plan_type || '中小学思政', count, duration || '', target_stage || '', note || '', '待确认').run()

  return c.json({ success: true, id: result.meta.last_row_id, status: '待确认' }, 201)
})

/** GET /api/bookings — 预约单列表（团队/政企） */
bookings.get('/', authMiddleware, requireRole('team', 'admin'), async (c) => {
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
    `SELECT id, org_name, contact, plan_type, people_count, duration, target_stage, note, status, created_at FROM bookings${where} ORDER BY id DESC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** PUT /api/bookings/:id — 更新预约单状态（待确认/已确认/已完成/已取消） */
bookings.put('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const body = await c.req.json().catch(() => null)
  const status = body?.status
  if (!['待确认', '已确认', '已完成', '已取消'].includes(status)) {
    return c.json({ error: '状态不正确' }, 400)
  }

  const result = await c.env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?')
    .bind(status, id).run()

  if (result.meta.changes === 0) return c.json({ error: '预约单不存在' }, 404)
  return c.json({ success: true, id, status })
})

export default bookings
