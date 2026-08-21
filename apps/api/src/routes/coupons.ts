import { Hono } from 'hono'
import type { Env } from '../types'

const coupons = new Hono<{ Bindings: Env }>()

/**
 * GET /api/coupons/verify?code=XXX — 校验优惠券（下单前预览抵扣）
 * 返回券的类型与面值，不修改状态（下单时才核销为已用）
 */
coupons.get('/verify', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.json({ valid: false, error: '请输入优惠券码' }, 400)

  const coupon = await c.env.DB.prepare("SELECT code, type, value, source, status FROM coupons WHERE code = ?")
    .bind(code.trim()).first()

  if (!coupon) return c.json({ valid: false, error: '优惠券不存在' }, 404)
  if (coupon.status !== '未用') return c.json({ valid: false, error: '该优惠券已使用' }, 400)

  return c.json({ valid: true, coupon })
})

export default coupons
