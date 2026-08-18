import { Hono } from 'hono'

const products = new Hono()

products.get('/', (c) => c.json({
  message: '商品接口，P10 实现',
  status: 'coming',
}))

export default products
