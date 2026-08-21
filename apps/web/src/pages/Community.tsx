import { useEffect, useState } from 'react';
import {
  Tabs, Form, Input, Select, Button, Radio, Card, Tag, Spin, Empty, Alert, message, Space, Typography,
} from 'antd';
import { SendOutlined, TrophyOutlined, CopyOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { submissionsAPI, suggestionsAPI, quizAPI } from '../api';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const SUBMIT_TYPES = ['老照片', '口述', '短视频'];
const SUGGEST_CATEGORIES = ['修缮保护', '文旅开发', '宣传推广', '其他'];

/** 乡土共创交互平台（P8）：红色记忆投稿 + 活化建言 + 互动答题 */
export default function CommunityPage() {
  return (
    <PageLayout title="乡土共创交互平台" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">乡土共创交互平台</h1>
        <p className="text-body">
          让每一位村民、游客与研究者都能参与桂阳古戏台的记录、保护与传播。
        </p>
      </div>
      <Tabs items={[
        { key: 'submit', label: '红色记忆投稿', children: <SubmitTab /> },
        { key: 'suggest', label: '活化建言留言板', children: <SuggestTab /> },
        { key: 'quiz', label: '互动答题闯关', children: <QuizTab /> },
      ]} />
    </PageLayout>
  );
}

/* ---------------- 投稿 ---------------- */
function SubmitTab() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionsAPI.list({ status: '已通过', limit: 30 })
      .then((res: any) => setList(res.list || []))
      .catch(() => message.error('已通过投稿加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      await submissionsAPI.submit(v);
      message.success('投稿已提交，审核通过后将公开展示');
      form.resetFields();
    } catch (e: any) {
      message.error(e?.error || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
      <Card title="上传红色记忆" size="small">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="author_name" label="您的称呼" rules={[{ required: true, message: '请填写称呼' }]}>
            <Input placeholder="如：李大叔" />
          </Form.Item>
          <Form.Item name="contact" label="联系方式（选填）">
            <Input placeholder="手机号 / 微信，便于工作人员联系" />
          </Form.Item>
          <Form.Item name="type" label="投稿类型" initialValue="老照片">
            <Select options={SUBMIT_TYPES.map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item name="content" label="内容描述" rules={[{ required: true, message: '请填写内容' }]}>
            <TextArea rows={4} placeholder="老照片拍摄年代与场景 / 口述故事 / 短视频说明" />
          </Form.Item>
          <Form.Item name="media_url" label="素材链接（选填）">
            <Input placeholder="图片/视频外链 URL" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={submitting} block>
            提交投稿（后台审核后展示）
          </Button>
        </Form>
      </Card>

      <Card title="已审核公开展示" size="small">
        <Spin spinning={loading}>
          {list.length === 0 && !loading ? (
            <Empty description="暂无已通过展示的投稿，期待你的第一份记忆" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 560, overflow: 'auto' }}>
              {list.map((s) => (
                <div key={s.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b>{s.author_name}</b>
                    <Tag color="green">{s.type}</Tag>
                  </div>
                  <Paragraph style={{ margin: '8px 0 0', color: '#555' }} ellipsis={{ rows: 3 }}>
                    {s.content}
                  </Paragraph>
                  <div style={{ color: '#aaa', fontSize: 12, marginTop: 6 }}>{s.created_at}</div>
                </div>
              ))}
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
}

/* ---------------- 建言 ---------------- */
function SuggestTab() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    suggestionsAPI.list({ limit: 30 })
      .then((res: any) => setList(res.list || []))
      .catch(() => message.error('建言列表加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const onFinish = async (v: any) => {
    setSubmitting(true);
    try {
      await suggestionsAPI.submit(v);
      message.success('建言已提交，将自动分类归档供文旅部门处理');
      form.resetFields();
    } catch (e: any) {
      message.error(e?.error || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const STATUS_COLOR: Record<string, string> = { 待处理: 'orange', 已归档: 'blue', 已采纳: 'green' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
      <Card title="为古戏台保护建言" size="small">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="建议标题" rules={[{ required: true, message: '请填写标题' }]}>
            <Input placeholder="如：建议加强破损戏台应急加固" />
          </Form.Item>
          <Form.Item name="category" label="建议分类" initialValue="修缮保护">
            <Select options={SUGGEST_CATEGORIES.map((c) => ({ value: c, label: c }))} />
          </Form.Item>
          <Form.Item name="content" label="建议内容" rules={[{ required: true, message: '请填写内容' }]}>
            <TextArea rows={4} placeholder="您的具体建议与理由" />
          </Form.Item>
          <Form.Item name="contact" label="联系方式（选填）">
            <Input placeholder="便于反馈处理结果" />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={submitting} block>
            提交建言
          </Button>
        </Form>
      </Card>

      <Card title="建言动态" size="small">
        <Spin spinning={loading}>
          {list.length === 0 && !loading ? (
            <Empty description="暂无建言" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 560, overflow: 'auto' }}>
              {list.map((s) => (
                <div key={s.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <b style={{ flex: 1 }}>{s.title}</b>
                    <Tag color={STATUS_COLOR[s.status] || 'default'}>{s.status}</Tag>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Tag>{s.category}</Tag>
                    <span style={{ color: '#aaa', fontSize: 12 }}>{s.created_at}</span>
                  </div>
                  <Paragraph style={{ margin: '8px 0 0', color: '#555' }} ellipsis={{ rows: 2 }}>
                    {s.content}
                  </Paragraph>
                </div>
              ))}
            </div>
          )}
        </Spin>
      </Card>
    </div>
  );
}

/* ---------------- 答题 ---------------- */
interface Question { id: number; question: string; option_a: string; option_b: string; option_c: string; option_d: string }

function QuizTab() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState('');

  const startQuiz = async () => {
    setResult(null);
    setAnswers({});
    try {
      const res: any = await quizAPI.random();
      setQuestions(res.list || []);
    } catch (e: any) {
      message.error(e?.error || '题库加载失败');
    }
  };

  useEffect(() => { startQuiz(); }, []);

  const submitQuiz = async () => {
    const answered = Object.keys(answers).length;
    if (answered < (questions?.length || 10)) {
      message.warning(`请完成全部题目（已答 ${answered}/${questions?.length}）`);
      return;
    }
    if (!phone.trim()) {
      message.warning('请填写手机号，通关后用于领取优惠券');
      return;
    }
    setSubmitting(true);
    try {
      const payload = (questions || []).map((q) => ({ question_id: q.id, answer: answers[q.id] }));
      const res: any = await quizAPI.submit({ answers: payload, phone: phone.trim() });
      setResult(res);
    } catch (e: any) {
      message.error(e?.error || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCoupon = () => {
    if (result?.coupon) {
      navigator.clipboard?.writeText(result.coupon).then(() => message.success('优惠券码已复制'));
    }
  };

  if (!questions) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Alert
        type="info"
        showIcon
        message="规则：随机抽取 10 题，正确率 ≥ 80% 即通关，发放 10 元文创电子优惠券（可在商城下单抵扣）"
        style={{ marginBottom: 16 }}
      />

      {questions.map((q, i) => (
        <Card key={q.id} size="small" style={{ marginBottom: 12 }} title={`第 ${i + 1} 题`}>
          <div style={{ marginBottom: 8 }}>{q.question}</div>
          <Radio.Group
            value={answers[q.id]}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
          >
            <Space direction="vertical">
              <Radio value="A">{q.option_a}</Radio>
              <Radio value="B">{q.option_b}</Radio>
              <Radio value="C">{q.option_c}</Radio>
              <Radio value="D">{q.option_d}</Radio>
            </Space>
          </Radio.Group>
        </Card>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Input
          placeholder="手机号（领券用）"
          style={{ maxWidth: 260 }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button type="primary" loading={submitting} onClick={submitQuiz}>提交答卷</Button>
        <Button onClick={startQuiz}>重新抽题</Button>
      </div>

      {result && (
        <Card
          style={{ marginTop: 16, borderColor: result.passed ? '#52c41a' : '#d9d9d9' }}
          title={<Space><TrophyOutlined style={{ color: result.passed ? '#D4A017' : '#999' }} />答题结果</Space>}
        >
          {result.passed ? (
            <>
              <Alert type="success" showIcon message={`恭喜通关！答对 ${result.score}/${result.total} 题`} style={{ marginBottom: 12 }} />
              <Paragraph>
                您的文创优惠券码：
                <Text code copyable style={{ fontSize: 16, color: '#A3232B' }}>{result.coupon}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={copyCoupon} style={{ marginLeft: 8 }}>复制</Button>
              </Paragraph>
              <Text type="secondary">前往商城下单时输入券码即可抵扣 10 元。</Text>
            </>
          ) : (
            <Alert type="warning" showIcon message={`答对 ${result.score}/${result.total} 题，未达 80% 通关线`} description="可点击「重新抽题」再来一次，通关后可领券。" />
          )}
        </Card>
      )}
    </div>
  );
}
