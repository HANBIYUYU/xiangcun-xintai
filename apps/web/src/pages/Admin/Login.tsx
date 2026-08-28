import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, message, Typography, Alert } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { authAPI } from '../../api'

const { Title } = Typography

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (values: any) => {
    setLoading(true)
    setError('')
    try {
      await authAPI.login(values)
      message.success('登录成功')
      navigate('/admin/dashboard')
    } catch (err: any) {
      // 验证失败（密码错误 / 账号不存在 / 其他原因）→ 表单内醒目提示
      setError(err?.error || '登录失败，请检查用户名和密码后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #A3232B 0%, #C0392B 45%, #D4A017 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3}>湘村新台 · 管理后台</Title>
          <p style={{ color: '#999' }}>桂阳古戏台红色文旅数字官网</p>
        </div>

        <Form onFinish={handleLogin}>
          {error && (
            <Form.Item style={{ marginBottom: 16 }}>
              <Alert type="error" showIcon message={error} />
            </Form.Item>
          )}

          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button onClick={() => navigate('/')} block>
              返回主页
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
