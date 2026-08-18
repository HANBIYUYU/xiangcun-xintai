import { Hono } from 'hono'

const news = new Hono()

news.get('/', (c) => c.json({
  message: '新闻动态接口，P2 实现',
  status: 'coming',
}))

export default news
