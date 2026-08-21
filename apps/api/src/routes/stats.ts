import { Hono } from 'hono'
import type { Env } from '../types'

const stats = new Hono<{ Bindings: Env }>()

/**
 * GET /api/stats — 首页数据看板统计
 * 收录戏台数 / 红色旧址戏台数 / 研学接待人次 / 文创销售额 / 待审核投稿数
 */
stats.get('/', async (c) => {
  const db = c.env.DB

  const [stages, redSites, people, revenue, pending] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM stages').first(),
    db.prepare('SELECT COUNT(*) AS n FROM stages WHERE is_red_site = 1').first(),
    db.prepare("SELECT COALESCE(SUM(people_count), 0) AS n FROM bookings WHERE status != '已取消'").first(),
    db.prepare("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status != '已取消'").first(),
    db.prepare("SELECT COUNT(*) AS n FROM submissions WHERE status = '待审核'").first(),
  ])

  return c.json({
    stages: Number(stages?.n ?? 0),
    redSites: Number(redSites?.n ?? 0),
    people: Number(people?.n ?? 0),
    revenue: Number(revenue?.n ?? 0),
    pendingSubmissions: Number(pending?.n ?? 0),
  })
})

export default stats
