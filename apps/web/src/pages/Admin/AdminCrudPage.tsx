import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm, message, Spin, Tag,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, PictureOutlined,
} from '@ant-design/icons';
import { MediaPickerModal } from './MediaLibrary';

const { TextArea } = Input;

export interface CrudField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'switch' | 'media' | 'video';
  options?: { value: string | number; label: string }[];
  required?: boolean;
  span?: 1 | 2; // 布局占位
}

export interface CrudConfig {
  title: string;
  rowKey: string;
  api: {
    list: (params?: any) => Promise<any>;
    create?: (data: any) => Promise<any>;
    update?: (id: any, data: any) => Promise<any>;
    remove?: (id: any) => Promise<any>;
  };
  columns: any[];
  fields: CrudField[];
  defaultValues?: Record<string, any>;
  /** 列表请求固定附加参数（如按分类过滤） */
  listParams?: Record<string, any>;
  /** 新增时固定写入的字段（如 category） */
  fixedValues?: Record<string, any>;
  rowColor?: (row: any) => string;
}

/** 数字/日期列自动排序，枚举列自动筛选（值种类少时） */
const SORTABLE = new Set(['id', 'created_at', 'updated_at', 'date', 'start_time', 'price', 'stock', 'sort_order']);

function useSmartColumns(config: CrudConfig, rows: any[]) {
  return useMemo(() => {
    const counts: Record<string, Set<string>> = {};
    rows.forEach((r) => {
      config.columns.forEach((c) => {
        const v = r[c.dataIndex];
        if (v == null || ['string', 'number'].indexOf(typeof v) < 0) return;
        (counts[c.dataIndex] ??= new Set()).add(String(v));
      });
    });
    return config.columns.map((c: any) => {
      const col: any = { ...c };
      if (!col.title) return col;
      if (SORTABLE.has(c.dataIndex)) {
        col.sorter = (a: any, b: any) => (a[c.dataIndex] ?? '') > (b[c.dataIndex] ?? '') ? 1 : -1;
      }
      const values = counts[c.dataIndex];
      if (values && values.size > 1 && values.size <= 12 && c.render === undefined) {
        col.filters = [...values].sort().map((v) => ({ text: v, value: v }));
        col.onFilter = (v: any, r: any) => String(r[c.dataIndex]) === String(v);
      }
      if (c.ellipsis === undefined && !c.width) col.ellipsis = true;
      return col;
    });
  }, [config, rows]);
}

/** 素材字段：输入框 + 「素材库」按钮（从图床选择，不必手填 URL）；kind=video 时只选视频 */
function MediaInput({ value, onChange, kind }: { value?: string; onChange?: (v: string) => void; kind?: 'video' }) {
  const [pick, setPick] = useState(false);
  const isVideo = kind === 'video';
  return (
    <>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={isVideo ? '/api/files/videos/... 或 B 站嵌入地址' : '/api/files/... 或外链 URL（可留空）'}
        />
        <Button icon={<PictureOutlined />} onClick={() => setPick(true)}>{isVideo ? '选视频' : '选图片'}</Button>
      </Space.Compact>
      {value ? (
        <div style={{ marginTop: 6 }}>
          {isVideo ? (
            <video src={value} controls muted style={{ maxWidth: '100%', maxHeight: 110, borderRadius: 8, background: '#000' }} />
          ) : (
            <img
              src={value}
              alt="封面预览"
              style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #f0f0f0' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>
      ) : null}
      <MediaPickerModal
        open={pick}
        onCancel={() => setPick(false)}
        onSelect={(url) => { onChange?.(url); setPick(false); }}
        kinds={isVideo ? ['video'] : undefined}
      />
    </>
  );
}

/** 通用管理端 CRUD 页：搜索 + 列筛选/排序 + 新增/编辑（素材字段走图床选择） */
export default function AdminCrudPage({ config }: { config: CrudConfig }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [kw, setKw] = useState('');
  const [form] = Form.useForm();

  const load = useCallback(() => {
    setLoading(true);
    config.api.list({ pageSize: 200, ...config.listParams })
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('数据加载失败'))
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => { load(); }, [load]);

  // 切回页面自动刷新（轻量实时同步）
  useEffect(() => {
    const onFocus = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [load]);

  const filtered = useMemo(() => {
    if (!kw.trim()) return rows;
    const q = kw.trim().toLowerCase();
    return rows.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(q));
  }, [rows, kw]);

  const smartColumns = useSmartColumns(config, rows);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    if (config.defaultValues) form.setFieldsValue(config.defaultValues);
    if (config.fixedValues) form.setFieldsValue(config.fixedValues);
    setOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    form.resetFields();
    form.setFieldsValue(row);
    setOpen(true);
  };

  const onSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        await config.api.update?.(editing[config.rowKey], values);
        message.success('已保存');
      } else {
        await config.api.create?.({ ...config.fixedValues, ...values });
        message.success('已新增');
      }
      setOpen(false);
      load();
    } catch (e: any) {
      message.error(e?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (row: any) => {
    try {
      await config.api.remove?.(row[config.rowKey]);
      message.success('已删除');
      load();
    } catch (e: any) {
      message.error(e?.error || '删除失败');
    }
  };

  const actionColumn = {
    title: '操作',
    key: '_actions',
    width: 150,
    fixed: 'right' as const,
    render: (_: any, row: any) => (
      <Space size={4}>
        {config.api.update && (
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(row)}>编辑</Button>
        )}
        {config.api.remove && (
          <Popconfirm title="确认删除？" onConfirm={() => onDelete(row)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        )}
      </Space>
    ),
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{config.title}</h2>
        <Space wrap>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: '#bbb' }} />}
            placeholder="搜索关键词…"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            style={{ width: 220 }}
          />
          <Button icon={<ReloadOutlined />} onClick={load}>刷新</Button>
          {config.api.create && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增</Button>
          )}
        </Space>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey={config.rowKey}
          columns={[...smartColumns, actionColumn]}
          dataSource={filtered}
          pagination={{ pageSize: 18, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ y: 'max(300px, calc(100vh - 330px))' }}
          size="middle"
          rowClassName={(row) => (config.rowColor ? config.rowColor(row) : '')}
        />
      </Spin>

      <Modal
        title={editing ? `编辑 ${config.title}` : `新增 ${config.title}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSave}
        confirmLoading={saving}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {config.fields.map((f) => (
            <Form.Item
              key={f.name}
              name={f.name}
              label={f.label}
              rules={f.required ? [{ required: true, message: `请填写${f.label}` }] : undefined}
              style={f.span === 1 ? { display: 'inline-block', width: '48%', marginRight: '2%' } : undefined}
              extra={f.type === 'media' ? '点击「素材库」从 R2 图床选择图片/视频' : f.type === 'video' ? '点击「选视频」从素材库选 R2 视频，或直接填 B 站嵌入地址' : undefined}
            >
              {f.type === 'textarea' ? (
                <TextArea rows={3} />
              ) : f.type === 'number' ? (
                <InputNumber style={{ width: '100%' }} />
              ) : f.type === 'select' ? (
                <Select options={f.options} />
              ) : f.type === 'switch' ? (
                <Switch checkedChildren="是" unCheckedChildren="否" />
              ) : f.type === 'media' ? (
                <MediaInput />
              ) : f.type === 'video' ? (
                <MediaInput kind="video" />
              ) : (
                <Input />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}

/** 通用状态标签 */
export function StatusTag({ status, map }: { status: string; map: Record<string, string> }) {
  return <Tag color={map[status] || 'default'}>{status}</Tag>;
}
