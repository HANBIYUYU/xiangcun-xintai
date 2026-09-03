import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { authAPI } from '../api'

const { Sider, Content } = Layout

/** 菜单按业务分组；roles 为空表示 team + admin 均可见
 * 权限：admin 仅 仪表盘/戏台档案/活动预告/订单；素材库与其余管理项归 team */
const MENU_GROUPS: { group: string; items: { key: string; label: string; roles?: string[] }[] }[] = [
  {
    group: '总览',
    items: [
      { key: '/admin/dashboard', label: '仪表盘' },
    ],
  },
  {
    group: '内容管理',
    items: [
      { key: '/admin/stages', label: '戏台档案' },
      { key: '/admin/red-plays', label: '红色戏曲', roles: ['team'] },
      { key: '/admin/articles', label: '互动阅读', roles: ['team'] },
      { key: '/admin/films', label: '首页影像', roles: ['team'] },
      { key: '/admin/news', label: '首页动态', roles: ['team'] },
      { key: '/admin/activities', label: '活动预告' },
      { key: '/admin/faq', label: '问答库', roles: ['team'] },
    ],
  },
  {
    group: '用户与业务',
    items: [
      { key: '/admin/submissions', label: '投稿审核', roles: ['team'] },
      { key: '/admin/suggestions', label: '建言归档', roles: ['team'] },
      { key: '/admin/quiz', label: '题库', roles: ['team'] },
      { key: '/admin/bookings', label: '研学预约', roles: ['team'] },
      { key: '/admin/products', label: '商品', roles: ['team'] },
      { key: '/admin/orders', label: '订单' },
    ],
  },
  {
    group: '素材',
    items: [
      { key: '/admin/media', label: '素材库（图床）', roles: ['team'] },
    ],
  },
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

  const menuItems = MENU_GROUPS.map((g) => ({
    type: 'group' as const,
    label: g.group,
    children: g.items
      .filter((m) => !m.roles || (user && m.roles.includes(user.role)))
      .map((m) => ({ key: m.key, label: <Link to={m.key}>{m.label}</Link> })),
  })).filter((g) => g.children.length > 0)

  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={224} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>湘村新台 · 管理后台</h3>
          {user && (
            <p style={{ margin: '8px 0 0', color: '#666', fontSize: 12 }}>
              {user.username}（{ROLE_LABEL[user.role] || user.role}）
            </p>
          )}
        </div>
        <div style={{ maxHeight: 'calc(100vh - 170px)', overflowY: 'auto' }}>
          <Menu
            mode="inline"
            style={{ borderInlineEnd: 'none', fontSize: 14 }}
            selectedKeys={[location.pathname]}
            items={menuItems}
          />
        </div>
        <div style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
          <Button onClick={() => navigate('/')} block style={{ marginBottom: 8 }}>返回主页</Button>
          <Button onClick={handleLogout} block danger>退出登录</Button>
        </div>
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5', fontSize: 14 }}>
        <Outlet />
      </Content>
    </Layout>
  )
}
