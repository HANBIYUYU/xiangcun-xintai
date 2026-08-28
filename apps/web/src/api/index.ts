import axios from 'axios'

// 扩展 axios 配置：公开接口可关闭 401 自动跳登录
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean
  }
}

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 仅管理端接口 401 时跳登录；公开接口（游客投稿/预约/下单等）交由页面自行处理
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      window.location.href = '/admin/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

export default api

// ============ 认证 ============
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// ============ 通用分页参数 ============
export interface PageParams {
  page?: number
  pageSize?: number
  [key: string]: unknown
}

// ============ 首页数据看板统计 ============
export const statsAPI = {
  overview: () => api.get('/stats'),
}

// ============ 戏台档案 ============
export const stagesAPI = {
  list: (params?: PageParams) => api.get('/stages', { params }),
  detail: (id: number | string) => api.get(`/stages/${id}`),
  metaTowns: () => api.get('/stages/meta/towns'),
  metaDamages: () => api.get('/stages/meta/damages'),
  create: (data: unknown) => api.post('/stages', data),
  update: (id: number | string, data: unknown) => api.put(`/stages/${id}`, data),
  remove: (id: number | string) => api.delete(`/stages/${id}`),
  exportExcel: () => api.get('/stages/export', { responseType: 'blob' }),
  exportPdf: (id: number | string) => api.get(`/stages/${id}/export`, { responseType: 'blob' }),
}

// ============ 红色戏曲 / 视频 ============
export const redPlaysAPI = {
  list: (params?: PageParams) => api.get('/red-plays', { params }),
  create: (data: unknown) => api.post('/red-plays', data),
  update: (id: number | string, data: unknown) => api.put(`/red-plays/${id}`, data),
  remove: (id: number | string) => api.delete(`/red-plays/${id}`),
}

// ============ 互动阅读 ============
export const articlesAPI = {
  list: (params?: PageParams) => api.get('/articles', { params }),
  detail: (id: number | string) => api.get(`/articles/${id}`),
  create: (data: unknown) => api.post('/articles', data),
  update: (id: number | string, data: unknown) => api.put(`/articles/${id}`, data),
  remove: (id: number | string) => api.delete(`/articles/${id}`),
}

// ============ 活动预告 ============
export const activitiesAPI = {
  list: (params?: PageParams) => api.get('/activities', { params }),
  create: (data: unknown) => api.post('/activities', data),
  update: (id: number | string, data: unknown) => api.put(`/activities/${id}`, data),
  remove: (id: number | string) => api.delete(`/activities/${id}`),
}

// ============ 红色记忆投稿 ============
export const submissionsAPI = {
  submit: (data: unknown) => api.post('/submissions', data, { skipAuthRedirect: true }),
  list: (params?: PageParams) => api.get('/submissions', { params }),
  review: (id: number | string, data: { status: '已通过' | '已驳回' }) => api.put(`/submissions/${id}/review`, data),
}

// ============ 活化建言 ============
export const suggestionsAPI = {
  submit: (data: unknown) => api.post('/suggestions', data, { skipAuthRedirect: true }),
  list: (params?: PageParams) => api.get('/suggestions', { params }),
  updateStatus: (id: number | string, data: { status: string }) => api.put(`/suggestions/${id}`, data),
  exportDoc: () => api.get('/suggestions/export', { responseType: 'blob' }),
}

// ============ 答题 ============
export const quizAPI = {
  random: () => api.get('/quiz/random'),
  submit: (data: { answers: { question_id: number; answer: string }[]; phone: string }) => api.post('/quiz/submit', data),
  list: () => api.get('/quiz'),
  create: (data: unknown) => api.post('/quiz', data),
  remove: (id: number) => api.delete(`/quiz/${id}`),
}

// ============ 研学 ============
export const studyPlansAPI = {
  list: () => api.get('/study-plans'),
}
export const bookingsAPI = {
  create: (data: unknown) => api.post('/bookings', data, { skipAuthRedirect: true }),
  list: (params?: PageParams) => api.get('/bookings', { params }),
  updateStatus: (id: number | string, data: { status: string }) => api.put(`/bookings/${id}`, data),
}
export const studyResultsAPI = {
  list: () => api.get('/study-results'),
}

// ============ 商城 ============
export const productsAPI = {
  list: (params?: PageParams) => api.get('/products', { params }),
  detail: (id: number | string) => api.get(`/products/${id}`),
  create: (data: unknown) => api.post('/products', data),
  update: (id: number | string, data: unknown) => api.put(`/products/${id}`, data),
  remove: (id: number | string) => api.delete(`/products/${id}`),
}
export const ordersAPI = {
  create: (data: unknown) => api.post('/orders', data, { skipAuthRedirect: true }),
  list: (params?: PageParams) => api.get('/orders', { params }),
  verify: (id: number | string) => api.post(`/orders/${id}/verify`),
  revenue: () => api.get('/orders/revenue'),
}
export const couponsAPI = {
  verify: (code: string) => api.get('/coupons/verify', { params: { code } }),
}

// ============ AI 问答 ============
export const faqAPI = {
  ask: (question: string) => api.post('/faq/ask', { question }, { skipAuthRedirect: true }),
  list: () => api.get('/faq'),
  create: (data: unknown) => api.post('/faq', data),
  update: (id: number | string, data: unknown) => api.put(`/faq/${id}`, data),
  remove: (id: number | string) => api.delete(`/faq/${id}`),
}

// ============ AI 戏台助手（悬浮组件） ============
export const aiChatAPI = {
  ask: (data: { message: string; session_id?: string; context?: string[]; source?: string }) =>
    api.post('/ai-chat', data, { skipAuthRedirect: true }),
}

// ============ 新闻 ============
export const newsAPI = {
  list: (params?: PageParams) => api.get('/news', { params }),
  create: (data: unknown) => api.post('/news', data),
  update: (id: number | string, data: unknown) => api.put(`/news/${id}`, data),
  remove: (id: number | string) => api.delete(`/news/${id}`),
}

// ============ 上传（R2 开通前为 stub） ============
export const uploadAPI = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
