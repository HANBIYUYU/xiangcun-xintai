import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import Home from './pages/Home'
import AIAssistant from './components/AIAssistant'
import ArchivePage from './pages/Archive'
import ArchiveDetailPage from './pages/ArchiveDetail'
import CulturePage from './pages/Culture'
import CommunityPage from './pages/Community'
import StudyPage from './pages/Study'
import MallPage from './pages/Mall'
import MapPage from './pages/Map'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminCrudPage from './pages/Admin/AdminCrudPage'
import {
  StagesAdminConfig, RedPlaysAdminConfig, ArticlesAdminConfig,
  ActivitiesAdminConfig, ProductsAdminConfig, FaqAdminConfig, FilmsAdminConfig, NewsAdminConfig,
} from './pages/Admin/Resources'
import { SubmissionsAdmin, SuggestionsAdmin, QuizAdmin, BookingsAdmin, OrdersAdmin } from './pages/Admin/SpecialPages'

// 三维展厅懒加载（three.js 体积较大，独立分包）；promise 可复用，供页面切换遮罩等待 chunk 就绪
let hall3dPromise: Promise<typeof import('./pages/Hall3D')> | null = null
function loadHall3D() {
  hall3dPromise ??= import('./pages/Hall3D')
  return hall3dPromise
}
const Hall3DPage = lazy(loadHall3D)

function PageLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Spin size="large" />
    </div>
  )
}

function App() {
  const location = useLocation()
  // 页面切换渐入（先跳转 → 等新页面就绪 → 再播放米白遮罩淡出）：
  // 路由变化时遮罩先保持不透明盖住加载过程；懒加载页等 chunk 下载完、普通页下一帧，才开始淡出
  const [fadeKey, setFadeKey] = useState(0)
  const [fadeReady, setFadeReady] = useState(false)
  const firstRender = useRef(true)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      prevPath.current = location.pathname
      return
    }
    const prev = prevPath.current
    prevPath.current = location.pathname
    const isAdmin = (p: string) => p.startsWith('/admin')
    // 后台内部跳转、或前台↔后台之间切换，都不播放米白遮罩（后台不需要渐入）
    if (isAdmin(location.pathname) || isAdmin(prev)) return
    setFadeReady(false)
    setFadeKey((k) => k + 1)
    let cancelled = false
    const done = () => { if (!cancelled) setFadeReady(true) }
    if (location.pathname.startsWith('/3d')) {
      loadHall3D().then(done)
    } else {
      const id = requestAnimationFrame(done)
      return () => { cancelled = true; cancelAnimationFrame(id) }
    }
    return () => { cancelled = true }
  }, [location.pathname])

  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <Routes>
        {/* 前台 */}
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/archive/:id" element={<ArchiveDetailPage />} />
        <Route path="/3d" element={<Hall3DPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/mall" element={<MallPage />} />

        {/* 管理后台 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stages" element={<AdminCrudPage config={StagesAdminConfig} />} />
          <Route path="red-plays" element={<AdminCrudPage config={RedPlaysAdminConfig} />} />
          <Route path="films" element={<AdminCrudPage config={FilmsAdminConfig} />} />
          <Route path="news" element={<AdminCrudPage config={NewsAdminConfig} />} />
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

      {/* AI 戏台助手：全站悬浮（左下角胶囊 → 聊天窗） */}
      <AIAssistant />

      {/* 页面切换渐入遮罩：未就绪前保持不透明盖住加载，就绪后淡出（导航 zIndex 1001 在其上层） */}
      {fadeKey > 0 && (
        <div key={fadeKey} className={`page-fade-overlay${fadeReady ? ' active' : ''}`} />
      )}
    </>
  )
}

export default App
