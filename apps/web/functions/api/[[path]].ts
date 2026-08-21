// Cloudflare Pages Function：将 /api/* 请求代理到 API Worker（同域，Cookie 正常）
// 部署目录：apps/web/functions/api/[[path]].ts
const API_ORIGIN = 'https://xiangcun-xintai-api-production.quaiquai11.workers.dev'

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url)
  const target = new URL(API_ORIGIN)
  target.pathname = url.pathname
  target.search = url.search

  const headers = new Headers(request.headers)
  headers.delete('host')

  return fetch(target.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  })
}
