import { jwtVerify } from 'jose'
import type { Context, Next } from 'hono'
import type { JWTPayload } from '../types'

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header('Cookie')?.match(/token=([^;]+)/)?.[1]

  if (!token) {
    return c.json({ error: '请先登录' }, 401)
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    c.set('user', payload)
    await next()
  } catch {
    return c.json({ error: '登录已过期，请重新登录' }, 401)
  }
}

/**
 * 角色权限控制高阶中间件（P0 先定义，P1 起在管理端写操作上启用）。
 * 用法：upload.post('/', authMiddleware, requireRole('admin'), handler)
 */
export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = (c.get('user') || {}) as Partial<JWTPayload>
    if (!user.role) {
      return c.json({ error: '请先登录' }, 401)
    }
    if (!roles.includes(user.role)) {
      return c.json({ error: '权限不足' }, 403)
    }
    await next()
  }
}
