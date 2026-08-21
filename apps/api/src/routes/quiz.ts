import { Hono } from 'hono'
import type { Env } from '../types'

const quiz = new Hono<{ Bindings: Env }>()

/** 生成优惠券码：XC + 时间戳36进制 + 两位随机数 */
function genCouponCode(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.floor(Math.random() * 90 + 10)
  return `XC${ts}${rand}`
}

/** GET /api/quiz/random — 随机抽取 10 题（不含答案） */
quiz.get('/random', async (c) => {
  const rows = await c.env.DB.prepare(
    'SELECT id, question, option_a, option_b, option_c, option_d, stage_id FROM quiz_questions ORDER BY RANDOM() LIMIT 10'
  ).all()

  if (rows.results.length === 0) {
    return c.json({ error: '题库为空，请稍后再试' }, 404)
  }
  return c.json({ list: rows.results, total: rows.results.length })
})

/**
 * POST /api/quiz/submit — 提交答案并判分
 * body: { answers: [{ question_id, answer }], phone }
 * 通关（≥80% 正确率）发放文创电子优惠券（source=答题）
 */
quiz.post('/submit', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: '请求格式错误' }, 400)

  const { answers, phone } = body as {
    answers?: { question_id: number; answer: string }[]
    phone?: string
  }
  if (!Array.isArray(answers) || answers.length === 0) {
    return c.json({ error: '请提交答案' }, 400)
  }

  const db = c.env.DB
  let correct = 0
  const details: { question_id: number; correct: boolean }[] = []

  for (const a of answers) {
    const row = await db.prepare('SELECT answer FROM quiz_questions WHERE id = ?')
      .bind(Number(a.question_id)).first()
    const ok = row != null && String(row.answer).toUpperCase() === String(a.answer).toUpperCase()
    if (ok) correct += 1
    details.push({ question_id: Number(a.question_id), correct: ok })
  }

  const total = answers.length
  const passed = correct / total >= 0.8

  let coupon: string | null = null
  if (passed) {
    coupon = genCouponCode()
    await db.prepare(
      'INSERT INTO coupons (code, type, value, owner_phone, source, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(coupon, '立减', 10, phone || '', '答题', '未用').run()
  }

  return c.json({
    success: true,
    score: correct,
    total,
    passed,
    coupon,
    message: passed
      ? `恭喜通关！获得 10 元文创优惠券：${coupon}`
      : `答对 ${correct}/${total} 题，未达 80% 通关线，再接再厉！`,
    details,
  })
})

export default quiz
