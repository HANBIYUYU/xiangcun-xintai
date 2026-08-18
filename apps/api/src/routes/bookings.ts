import { Hono } from 'hono'

const bookings = new Hono()

bookings.get('/', (c) => c.json({
  message: '研学预约接口，P8 实现',
  status: 'coming',
}))

export default bookings
