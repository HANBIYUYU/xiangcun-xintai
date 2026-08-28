import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

const stages = new Hono<{ Bindings: Env }>()

const HERITAGE_LEVELS = ['国家级', '省级', '市级', '县级', '未定级']
const DAMAGES = ['完好', '较好', '一般', '破损', '濒危']

function pickStageFields(body: any) {
  return {
    name: String(body?.name ?? '').trim(),
    town: String(body?.town ?? '').trim(),
    heritage_level: body?.heritage_level || '未定级',
    damage: body?.damage || '较好',
    built_year: String(body?.built_year ?? '').trim(),
    style: String(body?.style ?? '').trim(),
    history_text: String(body?.history_text ?? ''),
    red_story: String(body?.red_story ?? ''),
    repair_log: String(body?.repair_log ?? ''),
    audio_url: String(body?.audio_url ?? ''),
    lng: body?.lng != null ? Number(body.lng) : null,
    lat: body?.lat != null ? Number(body.lat) : null,
    cover_url: String(body?.cover_url ?? ''),
    is_red_site: body?.is_red_site ? 1 : 0,
  }
}

function esc(v: unknown): string {
  const s = String(v ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** 列表页展示字段（详情接口返回全字段） */
const LIST_FIELDS = 'id, name, town, heritage_level, damage, built_year, style, cover_url, is_red_site'

/** GET /api/stages/meta/towns — 乡镇下拉选项（去重） */
stages.get('/meta/towns', async (c) => {
  const rows = await c.env.DB.prepare('SELECT DISTINCT town FROM stages WHERE town != \'\' ORDER BY town').all()
  return c.json({ list: rows.results.map((r: any) => r.town) })
})

/** GET /api/stages — 列表：乡镇/文保等级/破损程度/红色旧址/关键词 + 分页 */
stages.get('/', async (c) => {
  const db = c.env.DB
  const q = c.req.query()
  const page = Math.max(1, Number(q.page || 1))
  const pageSize = Math.min(Math.max(Number(q.pageSize || 12), 1), 50)

  const conds: string[] = []
  const args: (string | number)[] = []
  if (q.town) { conds.push('town = ?'); args.push(q.town) }
  if (q.heritage_level) { conds.push('heritage_level = ?'); args.push(q.heritage_level) }
  if (q.damage) { conds.push('damage = ?'); args.push(q.damage) }
  if (q.is_red_site === '1' || q.is_red_site === 'true') { conds.push('is_red_site = 1') }
  if (q.keyword) {
    conds.push('(name LIKE ? OR town LIKE ? OR history_text LIKE ? OR red_story LIKE ?)')
    const kw = `%${q.keyword}%`
    args.push(kw, kw, kw, kw)
  }
  const where = conds.length ? ` WHERE ${conds.join(' AND ')}` : ''

  const totalRow = await db.prepare(`SELECT COUNT(*) AS n FROM stages${where}`).bind(...args).first()
  const total = Number(totalRow?.n ?? 0)

  const offset = (page - 1) * pageSize
  const rows = await db.prepare(
    `SELECT ${LIST_FIELDS} FROM stages${where} ORDER BY id ASC LIMIT ? OFFSET ?`
  ).bind(...args, pageSize, offset).all()

  return c.json({ list: rows.results, total, page, pageSize })
})

/** GET /api/stages/export — 全部台账导出（Excel 兼容 CSV，UTF-8 BOM） */
stages.get('/export', async (c) => {
  const rows = await c.env.DB.prepare('SELECT * FROM stages ORDER BY id ASC').all()
  const header = ['编号', '名称', '乡镇', '文保等级', '破损程度', '始建年代', '建筑形制', '红色旧址', '经度', '纬度', '建筑史料', '红色事迹', '修缮记录']
  const lines = [
    header.join(','),
    ...rows.results.map((r: any) => [
      r.id, r.name, r.town, r.heritage_level, r.damage, r.built_year, r.style,
      r.is_red_site ? '是' : '否', r.lng, r.lat, r.history_text, r.red_story, r.repair_log,
    ].map(esc).join(',')),
  ]
  c.header('Content-Type', 'text/csv; charset=utf-8')
  c.header('Content-Disposition', 'attachment; filename="guiyang_stages.csv"')
  return c.body('\uFEFF' + lines.join('\r\n'))
})

/** GET /api/stages/:id — 单戏台详情 */
stages.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)
  const row = await c.env.DB.prepare('SELECT * FROM stages WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: '戏台不存在' }, 404)
  return c.json(row)
})

/** GET /api/stages/:id/export — 单戏台导出：打印排版 HTML（浏览器打印/另存为 PDF） */
stages.get('/:id/export', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)
  const row = await c.env.DB.prepare('SELECT * FROM stages WHERE id = ?').bind(id).first()
  if (!row) return c.json({ error: '戏台不存在' }, 404)

  const r: any = row
  const block = (title: string, content: string) =>
    content
      ? `<div class="block"><h2>${title}</h2><p>${content.replace(/</g, '&lt;')}</p></div>`
      : ''

  c.header('Content-Type', 'text/html; charset=utf-8')
  return c.html(`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>${r.name} · 戏台档案</title>
<style>
  body { font-family: "Songti SC", "SimSun", serif; color: #2b1d1a; max-width: 720px; margin: 40px auto; padding: 0 24px; }
  h1 { color: #A3232B; border-bottom: 3px solid #D4A017; padding-bottom: 12px; }
  .meta { color: #666; font-size: 14px; line-height: 1.9; }
  .meta b { color: #3b2a26; }
  .block { margin-top: 18px; }
  .block h2 { font-size: 16px; color: #A3232B; margin: 0 0 6px; }
  .block p { margin: 0; line-height: 1.9; font-size: 15px; white-space: pre-wrap; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px dashed #ccc; color: #999; font-size: 12px; }
  @media print { body { margin: 0; } }
</style></head><body>
<h1>${r.name}</h1>
<div class="meta">
  <div>乡镇：<b>${r.town || '—'}</b>　文保等级：<b>${r.heritage_level || '—'}</b>　破损程度：<b>${r.damage || '—'}</b></div>
  <div>始建年代：<b>${r.built_year || '—'}</b>　建筑形制：<b>${r.style || '—'}</b>　红色旧址：<b>${r.is_red_site ? '是' : '否'}</b></div>
  <div>坐标：${r.lng != null ? r.lng.toFixed(4) : '—'}, ${r.lat != null ? r.lat.toFixed(4) : '—'}</div>
</div>
${block('建筑史料', r.history_text)}
${block('红色革命事迹', r.red_story)}
${block('修缮记录', r.repair_log)}
${block('村民口述', r.audio_url ? `音频：${r.audio_url}` : '')}
<div class="footer">湘村新台 · 桂阳古戏台红色文旅数字官网 —— 档案编号 ${r.id}</div>
</body></html>`)
})

/** POST /api/stages — 新增戏台（政企管理员） */
stages.post('/', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const body = await c.req.json().catch(() => null)
  const f = pickStageFields(body)
  if (!f.name) return c.json({ error: '戏台名称不能为空' }, 400)
  if (!HERITAGE_LEVELS.includes(f.heritage_level)) return c.json({ error: '文保等级不正确' }, 400)
  if (!DAMAGES.includes(f.damage)) return c.json({ error: '破损程度不正确' }, 400)

  const result = await c.env.DB.prepare(
    `INSERT INTO stages (name, town, heritage_level, damage, built_year, style, history_text, red_story, repair_log, audio_url, lng, lat, cover_url, is_red_site)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(f.name, f.town, f.heritage_level, f.damage, f.built_year, f.style, f.history_text, f.red_story, f.repair_log, f.audio_url, f.lng, f.lat, f.cover_url, f.is_red_site).run()

  return c.json({ success: true, id: result.meta.last_row_id }, 201)
})

/** PUT /api/stages/:id — 更新戏台（政企管理员） */
stages.put('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const body = await c.req.json().catch(() => null)
  const f = pickStageFields(body)
  if (!f.name) return c.json({ error: '戏台名称不能为空' }, 400)

  const result = await c.env.DB.prepare(
    `UPDATE stages SET name = ?, town = ?, heritage_level = ?, damage = ?, built_year = ?, style = ?, history_text = ?, red_story = ?, repair_log = ?, audio_url = ?, lng = ?, lat = ?, cover_url = ?, is_red_site = ?, updated_at = datetime('now','localtime') WHERE id = ?`
  ).bind(f.name, f.town, f.heritage_level, f.damage, f.built_year, f.style, f.history_text, f.red_story, f.repair_log, f.audio_url, f.lng, f.lat, f.cover_url, f.is_red_site, id).run()

  if (result.meta.changes === 0) return c.json({ error: '戏台不存在' }, 404)
  return c.json({ success: true, id })
})

/** DELETE /api/stages/:id — 删除戏台（政企管理员） */
stages.delete('/:id', authMiddleware, requireRole('team', 'admin'), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id) || id <= 0) return c.json({ error: '参数错误' }, 400)

  const result = await c.env.DB.prepare('DELETE FROM stages WHERE id = ?').bind(id).run()
  if (result.meta.changes === 0) return c.json({ error: '戏台不存在' }, 404)
  return c.json({ success: true, id })
})

export default stages
