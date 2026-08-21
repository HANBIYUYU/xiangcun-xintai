import { Hono } from 'hono'
import type { Env } from '../types'

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

export default activities
