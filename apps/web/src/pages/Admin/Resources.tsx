import { Tag } from 'antd';
import type { CrudConfig } from './AdminCrudPage';
import { stagesAPI, redPlaysAPI, articlesAPI, activitiesAPI, productsAPI, faqAPI } from '../../api';

const LEVEL_COLOR: Record<string, string> = { 国家级: 'red', 省级: 'volcano', 市级: 'gold', 县级: 'blue', 未定级: 'default' };

/* ---------------- 戏台档案（政企） ---------------- */
export const StagesAdminConfig: CrudConfig = {
  title: '戏台档案管理',
  rowKey: 'id',
  api: stagesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '乡镇', dataIndex: 'town', width: 110 },
    {
      title: '文保等级', dataIndex: 'heritage_level', width: 100,
      render: (v: string) => <Tag color={LEVEL_COLOR[v] || 'default'}>{v}</Tag>,
    },
    { title: '破损程度', dataIndex: 'damage', width: 90 },
    {
      title: '红色旧址', dataIndex: 'is_red_site', width: 90,
      render: (v: number) => (v ? <Tag color="red">是</Tag> : <Tag>否</Tag>),
    },
    { title: '始建年代', dataIndex: 'built_year', width: 120 },
  ],
  fields: [
    { name: 'name', label: '戏台名称', required: true },
    { name: 'town', label: '所属乡镇', span: 1 },
    { name: 'heritage_level', label: '文保等级', type: 'select', span: 1, options: ['国家级', '省级', '市级', '县级', '未定级'].map((v) => ({ value: v, label: v })) },
    { name: 'damage', label: '破损程度', type: 'select', span: 1, options: ['完好', '较好', '一般', '破损', '濒危'].map((v) => ({ value: v, label: v })) },
    { name: 'built_year', label: '始建年代', span: 1 },
    { name: 'style', label: '建筑形制', span: 1 },
    { name: 'lng', label: '经度', type: 'number', span: 1 },
    { name: 'lat', label: '纬度', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图 URL', span: 1 },
    { name: 'is_red_site', label: '红色旧址', type: 'switch', span: 1 },
    { name: 'history_text', label: '建筑史料', type: 'textarea' },
    { name: 'red_story', label: '红色革命事迹', type: 'textarea' },
    { name: 'repair_log', label: '修缮记录', type: 'textarea' },
    { name: 'audio_url', label: '口述音频 URL', span: 1 },
  ],
  defaultValues: { heritage_level: '未定级', damage: '较好', is_red_site: false },
};

/* ---------------- 红色戏曲（团队） ---------------- */
export const RedPlaysAdminConfig: CrudConfig = {
  title: '红色戏曲管理',
  rowKey: 'id',
  api: redPlaysAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '分类', dataIndex: 'category', width: 110,
      render: (v: string) => <Tag color={v === '折子戏' ? 'volcano' : 'blue'}>{v}</Tag>,
    },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'category', label: '分类', type: 'select', span: 1, options: [{ value: '折子戏', label: '折子戏' }, { value: '演出视频', label: '演出视频' }] },
    { name: 'sort_order', label: '排序', type: 'number', span: 1 },
    { name: 'iframe_src', label: '嵌入地址 iframe_src', span: 1 },
    { name: 'cover_url', label: '封面图 URL', span: 1 },
  ],
  defaultValues: { category: '折子戏', sort_order: 0 },
};

/* ---------------- 互动阅读（团队） ---------------- */
export const ArticlesAdminConfig: CrudConfig = {
  title: '互动阅读管理',
  rowKey: 'id',
  api: articlesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    { title: '来源', dataIndex: 'source', width: 130 },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
  ],
  fields: [
    { name: 'title', label: '标题', required: true },
    { name: 'source', label: '来源（如公众号）', span: 1 },
    { name: 'sort_order', label: '排序', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图 URL', span: 1 },
    { name: 'content', label: '正文内容', type: 'textarea' },
  ],
  defaultValues: { sort_order: 0 },
};

/* ---------------- 活动预告（团队/政企） ---------------- */
export const ActivitiesAdminConfig: CrudConfig = {
  title: '活动预告管理',
  rowKey: 'id',
  api: activitiesAPI,
  columns: [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '类型', dataIndex: 'type', width: 100,
      render: (v: string) => <Tag color={{ 红色党课: 'red', 非遗体验: 'gold', 戏曲汇演: 'purple' }[v] || 'default'}>{v}</Tag>,
    },
    { title: '地点', dataIndex: 'place' },
    { title: '开始时间', dataIndex: 'start_time', width: 150 },
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
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title' },
    {
      title: '分类', dataIndex: 'category', width: 90,
      render: (v: string) => <Tag color={v === '文创' ? 'volcano' : 'green'}>{v}</Tag>,
    },
    { title: '价格', dataIndex: 'price', width: 90, render: (v: number) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', width: 80 },
  ],
  fields: [
    { name: 'title', label: '商品名称', required: true },
    { name: 'category', label: '分类', type: 'select', span: 1, options: [{ value: '文创', label: '文创' }, { value: '农特产', label: '农特产' }] },
    { name: 'price', label: '价格（元）', type: 'number', span: 1 },
    { name: 'stock', label: '库存', type: 'number', span: 1 },
    { name: 'cover_url', label: '封面图 URL', span: 1 },
    { name: 'revenue_note', label: '收益说明', span: 1 },
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
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '问题', dataIndex: 'question', width: 240 },
    { title: '关键词', dataIndex: 'keywords', width: 200 },
    { title: '答案', dataIndex: 'answer', ellipsis: true },
  ],
  fields: [
    { name: 'question', label: '问题', required: true },
    { name: 'keywords', label: '关键词（逗号分隔）', span: 1 },
    { name: 'answer', label: '答案', type: 'textarea', required: true },
  ],
};
