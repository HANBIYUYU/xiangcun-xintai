import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import Home from './pages/Home'
import ArchivePage from './pages/Archive'
import ArchiveDetailPage from './pages/ArchiveDetail'
import CulturePage from './pages/Culture'
import CommunityPage from './pages/Community'
import StudyPage from './pages/Study'
import MallPage from './pages/Mall'
import AIPage from './pages/AI'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import ResourcePlaceholder from './pages/Admin/ResourcePlaceholder'

// 三维展厅懒加载（three.js 体积较大，独立分包）
const Hall3DPage = lazy(() => import('./pages/Hall3D'))

function PageLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* 前台 */}
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/archive/:id" element={<ArchiveDetailPage />} />
        <Route path="/3d" element={<Hall3DPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/mall" element={<MallPage />} />
        <Route path="/ai" element={<AIPage />} />

        {/* 管理后台 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stages" element={<ResourcePlaceholder title="戏台档案管理" description="戏台数字档案的增删改查与内容审核，P11 实现" />} />
          <Route path="red-plays" element={<ResourcePlaceholder title="红色戏曲管理" description="红色戏曲剧目、音视频与台本管理，P11 实现" />} />
          <Route path="articles" element={<ResourcePlaceholder title="互动阅读管理" description="红色互动阅读内容管理，P11 实现" />} />
          <Route path="activities" element={<ResourcePlaceholder title="活动预告管理" description="活动预告发布、编辑与上下架，P11 实现" />} />
          <Route path="submissions" element={<ResourcePlaceholder title="投稿审核管理" description="用户投稿的审核与发布，P11 实现" />} />
          <Route path="suggestions" element={<ResourcePlaceholder title="建言归档管理" description="用户建言的归档与回复，P11 实现" />} />
          <Route path="quiz" element={<ResourcePlaceholder title="题库管理" description="互动答题与 AI 问答题库维护，P11 实现" />} />
          <Route path="bookings" element={<ResourcePlaceholder title="研学预约管理" description="研学预约的查询与处理，P11 实现" />} />
          <Route path="products" element={<ResourcePlaceholder title="商品管理" description="文创助农产品与库存管理，P11 实现" />} />
          <Route path="orders" element={<ResourcePlaceholder title="订单管理" description="订单查询与售后处理，P11 实现" />} />
          <Route path="faq" element={<ResourcePlaceholder title="问答库管理" description="常见问题与知识库条目维护，P11 实现" />} />
        </Route>

        {/* 未匹配路由回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
