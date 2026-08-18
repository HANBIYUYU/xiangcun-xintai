import { Hono } from 'hono'

const upload = new Hono()

upload.get('/', (c) => c.json({
  message: '文件上传接口，P2 实现（待 R2 配置）',
  status: 'coming',
}))

export default upload
