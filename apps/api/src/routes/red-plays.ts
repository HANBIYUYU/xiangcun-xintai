import { Hono } from 'hono'

const redPlays = new Hono()

redPlays.get('/', (c) => c.json({
  message: '红色戏曲接口，P1/P2 实现',
  status: 'coming',
}))

export default redPlays
