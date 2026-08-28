import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { authAPI } from '../api'

const { Sider, Content } = Layout

/** 菜单定义：key / 标题 / 可见角色（undefined 表示 team + admin 均可见）
 * 权限（2026-08-21）：admin 仅 戏台档案 / 活动预告 / 订单；其余归 team（含新增的首页影像、首页动态） */
const MENU_DEFS = [
  { key: '/admin/dashboard', label: '仪表盘' },
  { key: '/admin/stages', label: '戏台档案' },
  { key: '/admin/red-plays', label: '红色戏曲', roles: ['team'] },
  { key: '/admin/films', label: '首页影像', roles: ['team'] },
  { key: '/admin/news', label: '首页动态', roles: ['team'] },
  { key: '/admin/articles', label: '互动阅读', roles: ['team'] },
  { key: '/admin/activities', label: '活动预告' },
  { key: '/admin/submissions', label: '投稿审核', roles: ['team'] },
  { key: '/admin/suggestions', label: '建言归档', roles: ['team'] },
  { key: '/admin/quiz', label: '题库', roles: ['team'] },
  { key: '/admin/bookings', label: '研学预约', roles: ['team'] },
  { key: '/admin/products', label: '商品', roles: ['team'] },
  { key: '/admin/orders', label: '订单' },
  { key: '/admin/faq', label: '问答库', roles: ['team'] },
]

const ROLE_LABEL: Record<string, string> = {
  team: '项目团队',
  admin: '政企文旅管理员',
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)

  useEffect(() => {
    if (location.pathname === '/admin/login') return
    authAPI.me().then((res: any) => {
      setUser({ username: res.username, role: res.role || 'team' })
    }).catch(() => {
      navigate('/admin/login')
    })
  }, [location.pathname])

  const handleLogout = async () => {
    await authAPI.logout()
    message.success('已退出登录')
    navigate('/admin/login')
  }

  const menuItems = MENU_DEFS
    .filter((m) => !m.roles || (user && m.roles.includes(user.role)))
    .map((m) => ({ key: m.key, label: <Link to={m.key}>{m.label}</Link> }))

  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>湘村新台 · 管理后台</h3>
          {user && (
            <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
              {user.username}（{ROLE_LABEL[user.role] || user.role}）
            </p>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
        <div style={{ padding: 16, position: 'absolute', bottom: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button onClick={() => navigate('/')} block>返回主页</Button>
          <Button onClick={handleLogout} block>退出登录</Button>
        </div>
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Outlet />
      </Content>
    </Layout>
  )
}
