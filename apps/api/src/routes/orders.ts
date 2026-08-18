import { Hono } from 'hono'

const orders = new Hono()

orders.get('/', (c) => c.json({
  message: '订单接口，P10 实现',
  status: 'coming',
}))

export default orders
