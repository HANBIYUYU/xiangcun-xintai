import { Hono } from 'hono'

const quiz = new Hono()

quiz.get('/', (c) => c.json({
  message: '题库接口，P12 实现',
  status: 'coming',
}))

export default quiz
