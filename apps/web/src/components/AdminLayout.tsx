import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { authAPI } from '../api'

const { Sider, Content } = Layout

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    if (location.pathname === '/admin/login') return
    authAPI.me().then((res: any) => {
      setUser(res.username)
    }).catch(() => {
      navigate('/admin/login')
    })
  }, [location.pathname])

  const handleLogout = async () => {
    await authAPI.logout()
    message.success('已退出登录')
    navigate('/admin/login')
  }

  const menuItems = [
    { key: '/admin/dashboard', label: <Link to="/admin/dashboard">仪表盘</Link> },
    { key: '/admin/stages', label: <Link to="/admin/stages">戏台档案</Link> },
    { key: '/admin/red-plays', label: <Link to="/admin/red-plays">红色戏曲</Link> },
    { key: '/admin/articles', label: <Link to="/admin/articles">互动阅读</Link> },
    { key: '/admin/activities', label: <Link to="/admin/activities">活动预告</Link> },
    { key: '/admin/submissions', label: <Link to="/admin/submissions">投稿审核</Link> },
    { key: '/admin/suggestions', label: <Link to="/admin/suggestions">建言归档</Link> },
    { key: '/admin/quiz', label: <Link to="/admin/quiz">题库</Link> },
    { key: '/admin/bookings', label: <Link to="/admin/bookings">研学预约</Link> },
    { key: '/admin/products', label: <Link to="/admin/products">商品</Link> },
    { key: '/admin/orders', label: <Link to="/admin/orders">订单</Link> },
    { key: '/admin/faq', label: <Link to="/admin/faq">问答库</Link> },
  ]

  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>湘村新台 · 管理后台</h3>
          {user && <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>{user}</p>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div style={{ padding: 16, position: 'absolute', bottom: 0, width: '100%' }}>
          <Button onClick={handleLogout} block>退出登录</Button>
        </div>
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}
