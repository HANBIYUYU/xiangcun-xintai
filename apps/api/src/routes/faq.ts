import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const faq = new Hono<{ Bindings: Env }>()

/**
 * POST /api/faq/ask — 台小湘问答：关键词命中优先，兜底返回常用引导
 * body: { question }
 */
faq.post('/ask', async (c) => {
  const body = await c.req.json().catch(() => null)
  const question = String(body?.question ?? '').trim()
  if (!question) return c.json({ error: '请输入问题' }, 400)

  const entries = await c.env.DB.prepare('SELECT id, question, keywords, answer FROM faq_entries').all()
  const rows = entries.results as any[]

  // 1) 关键词命中（question 或 keywords 包含）
  const hit = rows.find((r) =>
    (r.question && r.question.includes(question)) ||
    (r.keywords && r.keywords.split(/[,，]/).some((k: string) => k && question.includes(k)))
  )
  if (hit) {
    return c.json({ answer: hit.answer, matched: hit.question })
  }

  // 2) 常见问题引导
  return c.json({
    answer: '这个问题我还没学会，您可以试试问我：湘村新台是什么？桂阳有多少座古戏台？如何预约研学？如何投稿？答题怎么领券？',
    matched: null,
  })
})

/** GET /api/faq — 问答库列表（管理端用；编号 0 的介绍语置顶，其余最新在前） */
faq.get('/', authMiddleware, requireRole('team'), async (c) => {
  const rows = await c.env.DB.prepare('SELECT id, question, keywords, answer FROM faq_entries ORDER BY (id = 0) DESC, id DESC').all()
  return c.json({ list: rows.results, total: rows.results.length })
})

/** POST /api/faq — 新增问答（团队） */
faq.post('/', authMiddleware, requireRole('team'), async (c) => {
  const b = await c.req.json().catch(() => null)
  const question = String(b?.question ?? '').trim()
  const answer = String(b?.answer ?? '').trim()
  if (!question || !answer) return c.json({ error: '问题与答案不能为空' }, 400)

  const r = await c.env.DB.prepare('INSERT INTO faq_entries (question, keywords, answer) VALUES (?, ?, ?)')
    .bind(question, String(b?.keywords ?? ''), answer).run()
  return c.json({ success: true, id: r.meta.last_row_id }, 201)
})

/** PUT /api/faq/:id — 更新问答（团队） */
faq.put('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const b = await c.req.json().catch(() => null)
  const question = String(b?.question ?? '').trim()
  const answer = String(b?.answer ?? '').trim()
  if (!question || !answer) return c.json({ error: '问题与答案不能为空' }, 400)

  const r = await c.env.DB.prepare('UPDATE faq_entries SET question = ?, keywords = ?, answer = ? WHERE id = ?')
    .bind(question, String(b?.keywords ?? ''), answer, id).run()
  if (r.meta.changes === 0) return c.json({ error: '条目不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/faq/:id — 删除问答（团队） */
faq.delete('/:id', authMiddleware, requireRole('team'), async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare('DELETE FROM faq_entries WHERE id = ?').bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: '条目不存在' }, 404)
  return c.json({ success: true, id })
})

export default faq
