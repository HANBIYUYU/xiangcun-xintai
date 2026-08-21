import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const products = new Hono<{ Bindings: Env }>()

/** GET /api/products — 商品列表（可按 category 过滤、关键词搜索） */
products.get('/', async (c) => {
  const db = c.env.DB
  const category = c.req.query('category')
  const keyword = c.req.query('keyword')
  const limit = Math.min(Math.max(Number(c.req.query('limit') || 50), 1), 100)

  const conds: string[] = []
  const args: (string | number)[] = []
  if (category) {
    conds.push('category = ?')
    args.push(category)
  }
  if (keyword) {
    conds.push('(title LIKE ? OR description LIKE ?)')
    const kw = `%${keyword}%`
    args.push(kw, kw)
  }
  const where = conds.length ? ` WHERE ${conds.join(' AND ')}` : ''
  args.push(limit)

  const rows = await db.prepare(
    `SELECT id, title, category, price, stock, cover_url, description, revenue_note FROM products${where} ORDER BY id ASC LIMIT ?`
  ).bind(...args).all()

  return c.json({ list: rows.results, total: rows.results.length })
})

/** GET /api/products/:id — 商品详情 */
products.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)
  const row = await c.env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: '商品不存在' }, 404)
  return c.json(row)
})

/** POST /api/products — 新增（团队） */
products.post('/', authMiddleware, requireRole('team'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  const price = Number(b?.price ?? 0)
  if (!title) return c.json({ error: '商品名称不能为空' }, 400)
  if (price < 0) return c.json({ error: '价格不能为负' }, 400)

  const r = await c.env.DB.prepare(
    'INSERT INTO products (title, category, price, stock, cover_url, description, revenue_note) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(title, b?.category || '文创', price, Number(b?.stock || 0), String(b?.cover_url ?? ''), String(b?.description ?? ''), String(b?.revenue_note ?? '')).run()
  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/products/:id — 更新（团队） */
products.put('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const title = String(b?.title ?? '').trim()
  const price = Number(b?.price ?? 0)
  if (!title) return c.json({ error: '商品名称不能为空' }, 400)
  if (price < 0) return c.json({ error: '价格不能为负' }, 400)

  const r = await c.env.DB.prepare(
    'UPDATE products SET title = ?, category = ?, price = ?, stock = ?, cover_url = ?, description = ?, revenue_note = ? WHERE id = ?'
  ).bind(title, b?.category || '文创', price, Number(b?.stock || 0), String(b?.cover_url ?? ''), String(b?.description ?? ''), String(b?.revenue_note ?? ''), id).run()
  if (r.meta.changes === 0) return c.json({ error: '商品不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/products/:id — 删除（团队） */
products.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '商品不存在' }, 404)
  return c.json({ success: true, id })
})

export default products
