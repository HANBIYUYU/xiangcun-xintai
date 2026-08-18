import { Hono } from 'hono'

const stages = new Hono()

stages.get('/', (c) => c.json({
  message: '戏台档案接口，P1/P2 实现',
  status: 'coming',
}))

export default stages
