import { Hono } from 'hono'
import type { Env } from '../types'
import { authMiddleware, requireRole } from '../middleware/auth'

/**
 * R2 上传（2026-08 开通落地）：
 * - POST /api/upload        multipart 上传（字段 file）→ 存入 R2，返回可访问 URL
 * - GET  /api/files/*       读取 R2 对象并返回（Content-Type + 长缓存），供图片/视频直链
 */
const upload = new Hono<{ Bindings: Env }>()

/** 允许上传的 MIME → 扩展名（投稿图片 / 短视频） */
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

const MAX_BYTES = 100 * 1024 * 1024 // Workers Free 单请求体上限 100MB

upload.post('/', async (c) => {
  try {
    const form = await c.req.formData().catch(() => null)
    const file = form?.get('file')
    if (!(file instanceof File)) return c.json({ error: '缺少文件（字段名 file）' }, 400)

    const type = file.type || 'application/octet-stream'
    const ext = ALLOWED[type]
    if (!ext) return c.json({ error: `不支持的文件类型：${type}（仅图片 / 短视频）` }, 415)
    if (file.size === 0) return c.json({ error: '文件为空' }, 400)
    if (file.size > MAX_BYTES) return c.json({ error: '文件过大（≤100MB）' }, 413)

    const key = `uploads/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
    await c.env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: type },
      customMetadata: { name: file.name || '' },
    })
    return c.json({ success: true, url: `/api/files/${key}`, key, size: file.size, type })
  } catch (err) {
    console.error('upload failed', err)
    return c.json({ error: '上传失败，请稍后重试' }, 500)
  }
})

export default upload

/** 文件读取路由：挂载于 /api/files */
export const fileRoutes = new Hono<{ Bindings: Env }>()

// 桶内对象清单（团队；图床界面用；过滤目录标记，避免误删整个文件夹）
fileRoutes.get('/list', authMiddleware, requireRole('team'), async (c) => {
  const listed = await c.env.BUCKET.list({ limit: 1000 })
  return c.json({
    objects: listed.objects
      .filter((o) => !o.key.endsWith('/'))
      .map((o) => ({ key: o.key, size: o.size })),
  })
})

/** 官方素材目录白名单（团队上传专用，禁止写 uploads/ 与任意路径） */
const OFFICIAL_DIRS = ['hero', 'xitai_photos', 'maps', 'trend_cover', 'videos', 'placeholder_img']

// POST /api/files/upload — 团队上传官方素材：multipart file + dir + name（保持原文件名落位）
fileRoutes.post('/upload', authMiddleware, requireRole('team'), async (c) => {
  try {
    const form = await c.req.formData().catch(() => null)
    const file = form?.get('file')
    const dir = String(form?.get('dir') || '').replace(/^\/+|\/+$/g, '')
    const rawName = String(form?.get('name') || '')
    if (!(file instanceof File)) return c.json({ error: '缺少文件' }, 400)
    if (!OFFICIAL_DIRS.includes(dir)) return c.json({ error: `目录不允许（可选：${OFFICIAL_DIRS.join('/')}）` }, 400)
    // 文件名消毒：仅允许字母数字、中文、._-，防路径穿越
    const name = rawName.replace(/[\\/]/g, '').replace(/^\.+/, '')
    if (!name || !/^[\w\u4e00-\u9fa5._-]+$/.test(name)) return c.json({ error: '文件名不合法' }, 400)
    const type = file.type || 'application/octet-stream'
    if (file.size === 0) return c.json({ error: '文件为空' }, 400)
    if (file.size > MAX_BYTES) return c.json({ error: '文件过大（≤100MB）' }, 413)

    const key = `${dir}/${name}`
    await c.env.BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: type },
    })
    return c.json({ success: true, url: `/api/files/${key}`, key, size: file.size })
  } catch (err) {
    console.error('official upload failed', err)
    return c.json({ error: '上传失败，请稍后重试' }, 500)
  }
})

fileRoutes.get('*', async (c) => {
  // pathname 为百分号编码（中文文件名如专题图），先解码再取对象
  let key = ''
  try {
    key = decodeURIComponent(c.req.path.replace(/^\/api\/files\//, ''))
  } catch {
    return c.json({ error: '文件路径编码错误' }, 400)
  }
  if (!key) return c.json({ error: '缺少文件路径' }, 400)
  const obj = await c.env.BUCKET.get(key)
  if (!obj) return c.json({ error: '文件不存在' }, 404)
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(obj.body, { headers })
})

// DELETE /api/files?key=dir/xxx.jpg — 删除素材（团队；图床界面用）
fileRoutes.delete('/', authMiddleware, requireRole('team'), async (c) => {
  const key = String(c.req.query('key') || '').trim()
  // 安全：拒绝空 key、路径穿越、目录标记（xxx/）——目录只能在控制台整删，防止误删整个文件夹
  if (!key || key.includes('..') || key.endsWith('/')) return c.json({ error: '参数错误' }, 400)
  try {
    await c.env.BUCKET.delete(key)
    return c.json({ success: true, key })
  } catch (err) {
    console.error('delete failed', err)
    return c.json({ error: '删除失败' }, 500)
  }
})
