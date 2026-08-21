import { useCallback, useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag, Spin, Statistic, Card, Row, Col,
} from 'antd';
import { CheckOutlined, CloseOutlined, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { submissionsAPI, suggestionsAPI, quizAPI, bookingsAPI, ordersAPI } from '../../api';

const { TextArea } = Input;

const STATUS_MAP: Record<string, string> = {
  待审核: 'orange', 已通过: 'green', 已驳回: 'red',
  待处理: 'orange', 已归档: 'blue', 已采纳: 'green',
  待确认: 'orange', 已确认: 'blue', 已完成: 'green', 已取消: 'red',
  已核销: 'green',
};

/* ---------------- 投稿审核（团队） ---------------- */
export function SubmissionsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    submissionsAPI.list({ limit: 200 })
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const review = async (id: number, status: '已通过' | '已驳回') => {
    try {
      await submissionsAPI.review(id, { status });
      message.success(`已${status}`);
      load();
    } catch (e: any) {
      message.error(e?.error || '操作失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>投稿审核</h2>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: '作者', dataIndex: 'author_name', width: 110 },
            { title: '类型', dataIndex: 'type', width: 90, render: (v: string) => <Tag>{v}</Tag> },
            { title: '内容', dataIndex: 'content', ellipsis: true },
            { title: '素材链接', dataIndex: 'media_url', width: 160, ellipsis: true },
            { title: '状态', dataIndex: 'status', width: 90, render: (v: string) => <Tag color={STATUS_MAP[v]}>{v}</Tag> },
            { title: '提交时间', dataIndex: 'created_at', width: 160 },
            {
              title: '操作', width: 170,
              render: (_: any, row: any) => row.status === '待审核' ? (
                <Space>
                  <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => review(row.id, '已通过')}>通过</Button>
                  <Button size="small" danger icon={<CloseOutlined />} onClick={() => review(row.id, '已驳回')}>驳回</Button>
                </Space>
              ) : <span style={{ color: '#bbb' }}>—</span>,
            },
          ]}
        />
      </Spin>
    </div>
  );
}

/* ---------------- 建言归档（团队/政企） ---------------- */
export function SuggestionsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    suggestionsAPI.list({ limit: 200 })
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await suggestionsAPI.updateStatus(id, { status });
      message.success('已更新');
      load();
    } catch (e: any) {
      message.error(e?.error || '操作失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>建言归档</h2>
        <a href="/api/suggestions/export"><Button icon={<ExportOutlined />}>导出 CSV（文旅局/党史办归档）</Button></a>
      </div>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: '标题', dataIndex: 'title', width: 200 },
            { title: '分类', dataIndex: 'category', width: 100, render: (v: string) => <Tag color="gold">{v}</Tag> },
            { title: '内容', dataIndex: 'content', ellipsis: true },
            { title: '状态', dataIndex: 'status', width: 90, render: (v: string) => <Tag color={STATUS_MAP[v]}>{v}</Tag> },
            { title: '时间', dataIndex: 'created_at', width: 160 },
            {
              title: '处理', width: 160,
              render: (_: any, row: any) => (
                <Select
                  size="small"
                  style={{ width: 130 }}
                  value={row.status}
                  onChange={(v) => updateStatus(row.id, v)}
                  options={['待处理', '已归档', '已采纳'].map((s) => ({ value: s, label: s }))}
                />
              ),
            },
          ]}
        />
      </Spin>
    </div>
  );
}

/* ---------------- 题库管理（团队） ---------------- */
export function QuizAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(() => {
    setLoading(true);
    quizAPI.list()
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onAdd = async () => {
    const v = await form.validateFields();
    setSaving(true);
    try {
      await quizAPI.create(v);
      message.success('已新增');
      setOpen(false);
      form.resetFields();
      load();
    } catch (e: any) {
      message.error(e?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await quizAPI.remove(id);
      message.success('已删除');
      load();
    } catch (e: any) {
      message.error(e?.error || '删除失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>题库管理（{rows.length} 题）</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>新增题目</Button>
      </div>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: '题目', dataIndex: 'question', width: 300 },
            { title: 'A', dataIndex: 'option_a', width: 140 },
            { title: 'B', dataIndex: 'option_b', width: 140 },
            { title: 'C', dataIndex: 'option_c', width: 140 },
            { title: 'D', dataIndex: 'option_d', width: 140 },
            { title: '答案', dataIndex: 'answer', width: 60, render: (v: string) => <Tag color="red">{v}</Tag> },
            {
              title: '操作', width: 80,
              render: (_: any, row: any) => (
                <Popconfirm title="确认删除该题？" onConfirm={() => onDelete(row.id)}>
                  <Button size="small" danger>删除</Button>
                </Popconfirm>
              ),
            },
          ]}
        />
      </Spin>

      <Modal title="新增题目" open={open} onCancel={() => setOpen(false)} onOk={onAdd} confirmLoading={saving} width={640} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="question" label="题目" rules={[{ required: true, message: '请填写题目' }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="option_a" label="选项 A"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="option_b" label="选项 B"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="option_c" label="选项 C"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="option_d" label="选项 D"><Input /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="answer" label="正确答案" rules={[{ required: true, message: '请选择答案' }]}>
                <Select options={['A', 'B', 'C', 'D'].map((v) => ({ value: v, label: v }))} />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="explanation" label="解析"><Input /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

/* ---------------- 研学预约（团队/政企） ---------------- */
export function BookingsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    bookingsAPI.list({ limit: 200 })
      .then((res: any) => setRows(res.list || []))
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await bookingsAPI.updateStatus(id, { status });
      message.success('已更新');
      load();
    } catch (e: any) {
      message.error(e?.error || '操作失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>研学预约管理</h2>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 60 },
            { title: '单位', dataIndex: 'org_name', width: 180 },
            { title: '套餐', dataIndex: 'plan_type', width: 110, render: (v: string) => <Tag color={v === '中小学思政' ? 'red' : 'blue'}>{v}</Tag> },
            { title: '人数', dataIndex: 'people_count', width: 70 },
            { title: '时长', dataIndex: 'duration', width: 90 },
            { title: '目标戏台', dataIndex: 'target_stage', width: 140 },
            { title: '联系方式', dataIndex: 'contact', width: 160 },
            { title: '状态', dataIndex: 'status', width: 90, render: (v: string) => <Tag color={STATUS_MAP[v]}>{v}</Tag> },
            { title: '时间', dataIndex: 'created_at', width: 160 },
            {
              title: '处理', width: 150,
              render: (_: any, row: any) => (
                <Select
                  size="small"
                  style={{ width: 130 }}
                  value={row.status}
                  onChange={(v) => updateStatus(row.id, v)}
                  options={['待确认', '已确认', '已完成', '已取消'].map((s) => ({ value: s, label: s }))}
                />
              ),
            },
          ]}
        />
      </Spin>
    </div>
  );
}

/* ---------------- 订单管理（团队/政企） ---------------- */
export function OrdersAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      ordersAPI.list({ limit: 200 }),
      ordersAPI.revenue(),
    ])
      .then(([list, rev]: any[]) => {
        setRows(list.list || []);
        setRevenue(rev);
      })
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const verify = async (id: number) => {
    try {
      await ordersAPI.verify(id);
      message.success('已核销');
      load();
    } catch (e: any) {
      message.error(e?.error || '核销失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>订单管理 · 营收台账</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small"><Statistic title="累计营收（元）" value={revenue?.totalRevenue ?? 0} prefix="¥" /></Card>
        </Col>
        <Col span={8}>
          <Card size="small"><Statistic title="订单数" value={revenue?.orderCount ?? 0} /></Card>
        </Col>
        <Col span={8}>
          <Card size="small"><Statistic title="已核销优惠券" value={revenue?.couponUsedCount ?? 0} /></Card>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          dataSource={rows}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: '订单号', dataIndex: 'order_no', width: 180 },
            { title: '条目', dataIndex: 'items', ellipsis: true, render: (v: string) => {
              try { return JSON.parse(v).items.map((i: any) => `${i.title}×${i.qty}`).join('、'); } catch { return v; }
            } },
            { title: '总额', dataIndex: 'total', width: 90, render: (v: number) => `¥${v}` },
            { title: '券码', dataIndex: 'coupon_code', width: 130 },
            { title: '方式', dataIndex: 'pickup_type', width: 80 },
            { title: '联系人', dataIndex: 'contact', width: 150 },
            { title: '状态', dataIndex: 'status', width: 90, render: (v: string) => <Tag color={STATUS_MAP[v]}>{v}</Tag> },
            { title: '时间', dataIndex: 'created_at', width: 160 },
            {
              title: '操作', width: 90,
              render: (_: any, row: any) => row.status === '待处理' ? (
                <Button size="small" type="primary" onClick={() => verify(row.id)}>核销</Button>
              ) : <span style={{ color: '#bbb' }}>—</span>,
            },
          ]}
        />
      </Spin>
    </div>
  );
}
