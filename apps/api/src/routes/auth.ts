import { Hono } from 'hono'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import type { Env } from '../types'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json()

  if (!username || !password) {
    return c.json({ error: '用户名和密码不能为空' }, 400)
  }

  const db = c.env.DB
  const admin = await db.prepare('SELECT * FROM admins WHERE username = ?')
    .bind(username)
    .first()

  if (!admin) {
    return c.json({ error: '用户名或密码错误' }, 401)
  }

  const valid = await bcrypt.compare(password, admin.password_hash as string)
  if (!valid) {
    return c.json({ error: '用户名或密码错误' }, 401)
  }

  const jti = crypto.randomUUID()
  const secret = new TextEncoder().encode(c.env.JWT_SECRET)

  const token = await new SignJWT({
    id: String(admin.id),
    username: admin.username as string,
    role: (admin.role as string) || 'admin',
    jti,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  // 本地开发（http）不加 Secure，否则部分浏览器不保存 Cookie；生产环境强制 Secure
  const secure = c.env.ENVIRONMENT === 'production' ? '; Secure' : ''
  c.header('Set-Cookie', `token=${token}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=86400`)

  return c.json({ success: true, username: admin.username, role: admin.role })
})

auth.post('/logout', async (c) => {
  const token = c.req.header('Cookie')?.match(/token=([^;]+)/)?.[1]
  if (token) {
    try {
      const secret = new TextEncoder().encode(c.env.JWT_SECRET)
      await jwtVerify(token, secret)
    } catch {
      // ignore
    }
  }

  const secure = c.env.ENVIRONMENT === 'production' ? '; Secure' : ''
  c.header('Set-Cookie', `token=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`)
  return c.json({ success: true })
})

auth.get('/me', async (c) => {
  const token = c.req.header('Cookie')?.match(/token=([^;]+)/)?.[1]
  if (!token) {
    return c.json({ error: '未登录' }, 401)
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return c.json({ id: payload.id, username: payload.username, role: payload.role })
  } catch {
    return c.json({ error: '登录已过期' }, 401)
  }
})

export default auth
