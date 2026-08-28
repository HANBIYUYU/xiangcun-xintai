import { useCallback, useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm, message, Tag, Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export interface CrudField {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'switch';
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

/** 通用管理端 CRUD 页（P11）：表格 + 新增/编辑弹窗 + 删除确认 */
export default function AdminCrudPage({ config }: { config: CrudConfig }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(() => {
    setLoading(true);
    config.api.list({ pageSize: 200, ...config.listParams })
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('数据加载失败'))
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => { load(); }, [load]);

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
    width: 140,
    render: (_: any, row: any) => (
      <Space>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{config.title}</h2>
        {config.api.create && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增</Button>
        )}
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey={config.rowKey}
          columns={[...config.columns, actionColumn]}
          dataSource={rows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 'max-content' }}
          size="small"
          rowClassName={(row) => (config.rowColor ? config.rowColor(row) : '')}
        />
      </Spin>

      <Modal
        title={editing ? `编辑 ${config.title}` : `新增 ${config.title}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSave}
        confirmLoading={saving}
        width={640}
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
            >
              {f.type === 'textarea' ? (
                <TextArea rows={3} />
              ) : f.type === 'number' ? (
                <InputNumber style={{ width: '100%' }} />
              ) : f.type === 'select' ? (
                <Select options={f.options} />
              ) : f.type === 'switch' ? (
                <Switch checkedChildren="是" unCheckedChildren="否" />
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
