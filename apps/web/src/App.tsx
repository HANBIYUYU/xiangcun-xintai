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
import AdminCrudPage from './pages/Admin/AdminCrudPage'
import {
  StagesAdminConfig, RedPlaysAdminConfig, ArticlesAdminConfig,
  ActivitiesAdminConfig, ProductsAdminConfig, FaqAdminConfig,
} from './pages/Admin/Resources'
import { SubmissionsAdmin, SuggestionsAdmin, QuizAdmin, BookingsAdmin, OrdersAdmin } from './pages/Admin/SpecialPages'

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
          <Route path="stages" element={<AdminCrudPage config={StagesAdminConfig} />} />
          <Route path="red-plays" element={<AdminCrudPage config={RedPlaysAdminConfig} />} />
          <Route path="articles" element={<AdminCrudPage config={ArticlesAdminConfig} />} />
          <Route path="activities" element={<AdminCrudPage config={ActivitiesAdminConfig} />} />
          <Route path="submissions" element={<SubmissionsAdmin />} />
          <Route path="suggestions" element={<SuggestionsAdmin />} />
          <Route path="quiz" element={<QuizAdmin />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="products" element={<AdminCrudPage config={ProductsAdminConfig} />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="faq" element={<AdminCrudPage config={FaqAdminConfig} />} />
        </Route>

        {/* 未匹配路由回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
