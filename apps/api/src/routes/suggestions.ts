import { Hono } from 'hono'

const suggestions = new Hono()

suggestions.get('/', (c) => c.json({
  message: '建言归档接口，P3 实现',
  status: 'coming',
}))

export default suggestions
