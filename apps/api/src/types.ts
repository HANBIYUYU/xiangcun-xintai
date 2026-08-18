export interface Env {
  DB: D1Database
  JWT_SECRET: string
  ENVIRONMENT: string
}

export interface Admin {
  id: number
  username: string
  password_hash: string
  role: string
  created_at: string
}

/** 登录成功后写入 JWT 的载荷（P1 起随 admins 表落地） */
export interface JWTPayload {
  id: string
  username: string
  role: string
  jti: string
  exp: number
}
