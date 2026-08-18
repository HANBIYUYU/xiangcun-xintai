import { Hono } from 'hono'

const faq = new Hono()

faq.get('/', (c) => c.json({
  message: '问答库接口，P12 实现',
  status: 'coming',
}))

export default faq
