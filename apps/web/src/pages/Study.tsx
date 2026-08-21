import { useEffect, useState } from 'react';
import { Card, Tag, Form, Input, InputNumber, Select, Button, Spin, Empty, message, Tabs } from 'antd';
import { CalendarOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { studyPlansAPI, bookingsAPI, studyResultsAPI } from '../api';

const { TextArea } = Input;

const PLAN_TYPE_COLOR: Record<string, string> = { 中小学思政: 'red', 高校实践: 'blue' };

/** 研学预约服务中心（P9）：套餐展示 + 团体预约表单 + 成果展示 */
export default function StudyPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studyPlansAPI.list(),
      studyResultsAPI.list(),
    ])
      .then(([p, r]: any[]) => {
        setPlans(p.list || []);
        setResults(r.list || []);
      })
      .catch(() => message.error('研学中心内容加载失败'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="研学预约服务中心" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">研学预约服务中心</h1>
        <p className="text-body">
          面向学校、党团组织与亲子家庭，提供以古戏台为课堂的红色研学与非遗体验课程预约。
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
      ) : (
        <Tabs items={[
          { key: 'plans', label: `研学套餐（${plans.length}）`, children: <PlansTab plans={plans} /> },
          { key: 'booking', label: '团体预约', children: <BookingTab /> },
          { key: 'results', label: `研学成果（${results.length}）`, children: <ResultsTab results={results} /> },
        ]} />
      )}
    </PageLayout>
  );
}

/* ---------------- 套餐 ---------------- */
function PlansTab({ plans }: { plans: any[] }) {
  if (plans.length === 0) return <Empty description="暂无研学套餐" />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
      {plans.map((p) => (
        <Card
          key={p.id}
          title={<span>{p.title} <Tag color={PLAN_TYPE_COLOR[p.type] || 'default'}>{p.type}</Tag></span>}
          cover={
            p.cover_url
              ? <div style={{ height: 150, overflow: 'hidden' }}><img src={p.cover_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              : undefined
          }
        >
          <p><b>行程：</b>{p.schedule || '待公布'}</p>
          <p><b>课件：</b>{p.courseware || '—'}</p>
          <p><b>师资：</b>{p.teachers || '—'}</p>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- 预约表单 ---------------- */
function BookingTab() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      const res: any = await bookingsAPI.create(v);
      message.success(`预约单已提交（编号 ${res.id}），工作人员将尽快与您联系确认`);
      form.resetFields();
    } catch (e: any) {
      message.error(e?.error || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="团体预约表单" size="small" style={{ maxWidth: 640 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="org_name" label="组织 / 单位名称" rules={[{ required: true, message: '请填写单位名称' }]}>
          <Input placeholder="如：郴州市第十八中学" />
        </Form.Item>
        <Form.Item name="contact" label="联系人及电话" rules={[{ required: true, message: '请填写联系方式' }]}>
          <Input placeholder="姓名 + 手机号" />
        </Form.Item>
        <Form.Item name="plan_type" label="研学套餐类型" initialValue="中小学思政">
          <Select options={[{ value: '中小学思政', label: '中小学红色思政研学' }, { value: '高校实践', label: '高校非遗建筑实践研学' }]} />
        </Form.Item>
        <Form.Item name="people_count" label="预计人数" rules={[{ required: true, message: '请填写人数' }]}>
          <InputNumber min={1} max={10000} style={{ width: '100%' }} placeholder="人数" />
        </Form.Item>
        <Form.Item name="duration" label="研学时长">
          <Input placeholder="如：1 天 / 3 天" />
        </Form.Item>
        <Form.Item name="target_stage" label="目标研学 / 参访古戏台">
          <Input placeholder="如：荷叶镇老屋戏台" />
        </Form.Item>
        <Form.Item name="note" label="备注（选填）">
          <TextArea rows={3} placeholder="特殊需求说明" />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<CalendarOutlined />} loading={submitting} block>
          提交预约（后台自动生成预约单）
        </Button>
      </Form>
    </Card>
  );
}

/* ---------------- 成果 ---------------- */
function ResultsTab({ results }: { results: any[] }) {
  if (results.length === 0) return <Empty description="暂无研学成果" />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
      {results.map((r) => (
        <Card key={r.id} size="small">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <TeamOutlined style={{ color: '#A3232B' }} />
            <b>{r.org_name}</b>
            <Tag><BookOutlined /> {r.title}</Tag>
          </div>
          <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>{r.content}</p>
          <div style={{ color: '#aaa', fontSize: 12, marginTop: 8 }}>{r.created_at}</div>
        </Card>
      ))}
    </div>
  );
}
