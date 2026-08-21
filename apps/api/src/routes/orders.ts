import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const orders = new Hono<{ Bindings: Env }>()

interface OrderItem { title: string; qty: number; price: number }

/** 生成订单号：XC + 年月日时分秒 + 3 位随机数 */
function genOrderNo(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  return `XC${ts}${Math.floor(Math.random() * 900 + 100)}`
}

/** POST /api/orders — 下单：购物车条目 + 优惠券抵扣 + 自提/配送 */
orders.post('/', async (c) => {
  const db = c.env.DB
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: '请求格式错误' }, 400)

  const { items, coupon_code, pickup_type, contact } = body as {
    items?: OrderItem[]
    coupon_code?: string
    pickup_type?: string
    contact?: string
  }

  if (!Array.isArray(items) || items.length === 0) {
    return c.json({ error: '购物车为空' }, 400)
  }
  if (!contact?.trim()) return c.json({ error: '请填写联系人信息' }, 400)
  if (pickup_type && !['自提', '配送'].includes(pickup_type)) {
    return c.json({ error: '提货方式不正确' }, 400)
  }
  for (const it of items) {
    if (!it?.title || !Number(it.qty) || !Number(it.price)) {
      return c.json({ error: '订单条目不完整' }, 400)
    }
  }

  let total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0)
  let finalCoupon = ''

  if (coupon_code) {
    const coupon = await db.prepare("SELECT * FROM coupons WHERE code = ? AND status = '未用'")
      .bind(coupon_code.trim()).first()
    if (!coupon) return c.json({ error: '优惠券无效或已使用' }, 400)
    if (coupon.type === '立减') {
      total = Math.max(0, total - Number(coupon.value))
    } else if (coupon.type === '折扣') {
      total = Math.round(total * Number(coupon.value) * 100) / 100
    }
    finalCoupon = String(coupon.code)
    await db.prepare("UPDATE coupons SET status = '已用' WHERE code = ?").bind(finalCoupon).run()
  }

  const orderNo = genOrderNo()
  await db.prepare(
    'INSERT INTO orders (order_no, items, total, coupon_code, pickup_type, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    orderNo,
    JSON.stringify({ items }),
    Math.round(total * 100) / 100,
    finalCoupon,
    pickup_type || '自提',
    contact.trim(),
    '待处理',
  ).run()

  return c.json({ success: true, order_no: orderNo, total: Math.round(total * 100) / 100, coupon_used: !!finalCoupon }, 201)
})

/** GET /api/orders — 订单列表（团队/政企） */
orders.get('/', authMiddleware, requireRole('team', 'admin'), async (c) => {
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
    `SELECT id, order_no, items, total, coupon_code, pickup_type, contact, status, created_at FROM orders${where} ORDER BY id DESC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** GET /api/orders/revenue — 营收台账（团队/政企） */
orders.get('/revenue', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const db = c.env.DB
  const [revenue, orderCount, couponUsed] = await Promise.all([
    db.prepare("SELECT COALESCE(SUM(total), 0) AS n FROM orders WHERE status != '已取消'").first(),
    db.prepare("SELECT COUNT(*) AS n FROM orders WHERE status != '已取消'").first(),
    db.prepare("SELECT COUNT(*) AS n FROM coupons WHERE status = '已用'").first(),
  ])
  return c.json({
    totalRevenue: Number(revenue?.n ?? 0),
    orderCount: Number(orderCount?.n ?? 0),
    couponUsedCount: Number(couponUsed?.n ?? 0),
  })
})

/** POST /api/orders/:id/verify — 核销订单（团队/政企） */
orders.post('/:id/verify', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const result = await c.env.DB.prepare("UPDATE orders SET status = '已核销' WHERE id = ? AND status = '待处理'")
    .bind(id).run()

  if (result.meta.changes === 0) return c.json({ error: '订单不存在或状态不允许核销' }, 400)
  return c.json({ success: true, id, status: '已核销' })
})

export default orders
