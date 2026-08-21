import { Hono } from 'hono'
import type { Env } from '../types'

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

export default redPlays
