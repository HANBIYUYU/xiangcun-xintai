import { Hono } from 'hono'
import type { Env } from '../types'

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

export default products
