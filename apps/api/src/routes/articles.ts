import { Hono } from 'hono'

const articles = new Hono()

articles.get('/', (c) => c.json({
  message: '互动阅读接口，P1/P2 实现',
  status: 'coming',
}))

export default articles
