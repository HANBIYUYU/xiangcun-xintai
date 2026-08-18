import { Hono } from 'hono'

const activities = new Hono()

activities.get('/', (c) => c.json({
  message: '活动预告接口，P1/P2 实现',
  status: 'coming',
}))

export default activities
