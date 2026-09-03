import { Hono } from 'hono'
import type { Env } from '../types'

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

fileRoutes.get('*', async (c) => {
  const key = c.req.path.replace(/^\/api\/files\//, '')
  if (!key) return c.json({ error: '缺少文件路径' }, 400)
  const obj = await c.env.BUCKET.get(key)
  if (!obj) return c.json({ error: '文件不存在' }, 404)
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(obj.body, { headers })
})
