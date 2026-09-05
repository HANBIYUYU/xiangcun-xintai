import { Tag } from 'antd';
import type { CrudConfig } from './AdminCrudPage';
import { stagesAPI, redPlaysAPI, articlesAPI, activitiesAPI, productsAPI, faqAPI, newsAPI } from '../../api';

const LEVEL_COLOR: Record<string, string> = { 国家级: 'red', 省级: 'volcano', 市级: 'gold', 县级: 'blue', 未定级: 'default' };

/** 封面小图预览列渲染 */
const coverPreview = (v?: string) =>
  v ? (
    <img src={v} alt="封面" loading="lazy" style={{ height: 34, width: 60, objectFit: 'cover', borderRadius: 5, display: 'block' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
  ) : (
    <span style={{ color: '#bbb', fontSize: 12 }}>无</span>
  );

/** 封面图字段：图床选择或手填 URL */
const coverField = { type: 'media' as const, span: 2 as const };

/* ---------------- 戏台档案（政企 + 团队） ---------------- */
export const StagesAdminConfig: CrudConfig = {
  title: '戏台档案管理',
  rowKey: 'id',
  api: stagesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '名称', dataIndex: 'name' },
    { title: '乡镇', dataIndex: 'town', width: 110 },
    {
      title: '文保等级', dataIndex: 'heritage_level', width: 104,
      render: (v: string) => <Tag color={LEVEL_COLOR[v] || 'default'}>{v}</Tag>,
    },
    {
      title: '红色旧址', dataIndex: 'is_red_site', width: 84,
      render: (v: number) => (v ? <Tag color="red">是</Tag> : <Tag>否</Tag>),
    },
  ],
  fields: [
    // 身份
    { name: 'name', label: '戏台名称', required: true },
    { name: 'name_en', label: '英文标题', span: 1 },
    { name: 'is_red_site', label: '红色旧址', type: 'switch', span: 1 },
    // 属地
    { name: 'town', label: '所属镇村', span: 1 },
    { name: 'province', label: '省', span: 1 },
    { name: 'city', label: '市', span: 1 },
    { name: 'address', label: '详细地址', span: 1 },
    { name: 'ancestral_hall', label: '所属宗祠', span: 1 },
    // 文保
    { name: 'heritage_level', label: '文保等级', type: 'select', span: 1, options: ['国家级', '省级', '市级', '县级', '未定级'].map((v) => ({ value: v, label: v })) },
    { name: 'heritage_batch', label: '文保批次', span: 1 },
    { name: 'heritage_date', label: '公布时间', span: 1 },
    { name: 'heritage_type', label: '文保类型', span: 1 },
    // 建筑与保护
    { name: 'era', label: '时代', span: 1 },
    { name: 'built_year', label: '始建年份', span: 1 },
    { name: 'style', label: '建筑形制', span: 1 },
    { name: 'damage', label: '保护现状', span: 1 },
    // 坐标与素材
    { name: 'lng', label: '经度', type: 'number', span: 1 },
    { name: 'lat', label: '纬度', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    // 内容
    { name: 'history_text', label: '建筑史料', type: 'textarea' },
    { name: 'repair_log', label: '修缮记录', type: 'textarea' },
    { name: 'red_story', label: '红色革命事迹', type: 'textarea' },
    { name: 'media_links', label: '网络资料链接', type: 'textarea' },
    { name: 'oral_history', label: '村民口述访谈（文字）', type: 'textarea' },
    { name: 'audio_url', label: '口述音频 URL（备用）', span: 1 },
  ],
  defaultValues: { heritage_level: '未定级', damage: '较好', is_red_site: false },
};

/* ---------------- 红色戏曲（团队） ---------------- */
export const RedPlaysAdminConfig: CrudConfig = {
  title: '红色戏曲管理',
  rowKey: 'id',
  api: redPlaysAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '标题', dataIndex: 'title' },
    {
      title: '分类', dataIndex: 'category', width: 96,
      render: (v: string) => <Tag color={v === '折子戏' ? 'volcano' : 'blue'}>{v}</Tag>,
    },
    { title: '排序', dataIndex: 'sort_order', width: 64 },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'category', label: '分类', type: 'select', span: 1, options: [{ value: '折子戏', label: '折子戏' }, { value: '演出视频', label: '演出视频' }] },
    { name: 'sort_order', label: '排序', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    { name: 'iframe_src', label: '视频（素材库选 R2 视频，或填 B 站嵌入地址）', type: 'video', span: 2 },
  ],
  defaultValues: { category: '折子戏', sort_order: 0 },
};

/* ---------------- 互动阅读（团队） ---------------- */
export const ArticlesAdminConfig: CrudConfig = {
  title: '互动阅读管理',
  rowKey: 'id',
  api: articlesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '标题', dataIndex: 'title' },
    { title: '来源', dataIndex: 'source', width: 120 },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'source', label: '来源（如公众号/媒体名）', span: 1 },
    { name: 'sort_order', label: '排序', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    { name: 'source_url', label: '原文链接 URL（阅读页可跳转）', span: 2 },
    { name: 'content', label: '正文内容（含网址会自动变成可点击链接）', type: 'textarea' },
  ],
  defaultValues: { sort_order: 0 },
};

/* ---------------- 活动预告（团队/政企） ---------------- */
export const ActivitiesAdminConfig: CrudConfig = {
  title: '活动预告管理',
  rowKey: 'id',
  api: activitiesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '类型', dataIndex: 'type', width: 96,
      render: (v: string) => <Tag color={{ 红色党课: 'red', 非遗体验: 'gold', 戏曲汇演: 'purple' }[v] || 'default'}>{v}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (v: string) => <Tag color={{ 报名中: 'green', 已结束: 'default', 已取消: 'red' }[v] || 'default'}>{v}</Tag>,
    },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'type', label: '类型', type: 'select', span: 1, options: ['红色党课', '非遗体验', '戏曲汇演'].map((v) => ({ value: v, label: v })) },
    { name: 'status', label: '状态', type: 'select', span: 1, options: ['报名中', '已结束', '已取消'].map((v) => ({ value: v, label: v })) },
    { name: 'place', label: '地点', span: 1 },
    { name: 'start_time', label: '开始时间（如 2026-10-01 19:00）', span: 1 },
    { name: 'end_time', label: '结束时间', span: 1 },
  ],
  defaultValues: { type: '红色党课', status: '报名中' },
};

/* ---------------- 商品（团队） ---------------- */
export const ProductsAdminConfig: CrudConfig = {
  title: '商品管理',
  rowKey: 'id',
  api: productsAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '标题', dataIndex: 'title' },
    {
      title: '分类', dataIndex: 'category', width: 80,
      render: (v: string) => <Tag color={v === '文创' ? 'volcano' : 'green'}>{v}</Tag>,
    },
    { title: '价格', dataIndex: 'price', width: 84, render: (v: number) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', width: 70 },
  ],
  fields: [
    { name: 'title', label: '商品名称', required: true },
    { name: 'category', label: '分类', type: 'select', span: 1, options: [{ value: '文创', label: '文创' }, { value: '农特产', label: '农特产' }] },
    { name: 'price', label: '价格（元）', type: 'number', span: 1 },
    { name: 'stock', label: '库存', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    { name: 'revenue_note', label: '收益说明', span: 2 },
    { name: 'description', label: '商品描述', type: 'textarea' },
  ],
  defaultValues: { category: '文创', price: 0, stock: 0 },
};

/* ---------------- 问答库（团队） ---------------- */
export const FaqAdminConfig: CrudConfig = {
  title: '问答库管理',
  rowKey: 'id',
  api: faqAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '问题', dataIndex: 'question', width: 220 },
    { title: '答案', dataIndex: 'answer', ellipsis: true },
  ],
  fields: [
    { name: 'question', label: '问题', required: true },
    { name: 'keywords', label: '关键词（逗号分隔）', span: 2 },
    { name: 'answer', label: '答案', type: 'textarea', required: true },
  ],
};

/* ---------------- 首页影像（团队）— 首页短片区，固定 category=演出视频 ---------------- */
export const FilmsAdminConfig: CrudConfig = {
  title: '首页影像管理',
  rowKey: 'id',
  api: redPlaysAPI,
  listParams: { category: '演出视频' },
  fixedValues: { category: '演出视频' },
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '标题', dataIndex: 'title' },
    {
      title: '排序', dataIndex: 'sort_order', width: 80,
      render: (v: number) => <Tag color="blue">{v}</Tag>,
    },
  ],
  fields: [
    { name: 'title', label: '短片标题', required: true },
    { name: 'sort_order', label: '排序（小到大）', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    { name: 'iframe_src', label: '视频（素材库选 R2 视频，或填 B 站嵌入地址）', type: 'video', span: 2 },
  ],
  defaultValues: { sort_order: 0 },
};

/* ---------------- 首页动态（团队）— 首页新闻区 ---------------- */
export const NewsAdminConfig: CrudConfig = {
  title: '首页动态管理',
  rowKey: 'id',
  api: newsAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 84 },
    { title: '封面', dataIndex: 'cover_url', width: 72, render: coverPreview },
    { title: '标题', dataIndex: 'title' },
    { title: '日期', dataIndex: 'date', width: 116 },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'date', label: '日期（如 2026-08-21）', span: 1 },
    { name: 'cover_url', label: '封面图', ...coverField },
    { name: 'content', label: '正文内容', type: 'textarea' },
  ],
};
