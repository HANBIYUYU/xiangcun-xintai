import { Hono } from 'hono'

const submissions = new Hono()

submissions.get('/', (c) => c.json({
  message: '投稿审核接口，P3 实现',
  status: 'coming',
}))

export default submissions
