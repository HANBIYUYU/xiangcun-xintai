import { useRef, useState } from 'react';
import { Input, Button, Tag, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { faqAPI } from '../api';

const QUICK_QUESTIONS = [
  '湘村新台是什么平台？',
  '桂阳共有多少座古戏台？',
  '如何预约研学？',
  '答题如何获得优惠券？',
  '湘昆是什么？',
  '湘南起义与桂阳有什么关系？',
  '优惠券如何使用？',
  '资料可以导出吗？',
];

interface Msg { role: 'user' | 'bot'; text: string; matched?: string }

/** AI 智能问答助手 · 台小湘（P12）：固定问答库关键词匹配 */
export default function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: '你好，我是台小湘！关于桂阳古戏台、红色历史、湘昆非遗、研学与商城的问题，都可以问我哦～' },
  ]);
  const [input, setInput] = useState('');
  const [asking, setAsking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || asking) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setAsking(true);
    scrollToBottom();
    try {
      const res: any = await faqAPI.ask(q);
      setMessages((m) => [...m, { role: 'bot', text: res.answer, matched: res.matched }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'bot', text: e?.error || '台小湘走神了，请稍后再试。' }]);
    } finally {
      setAsking(false);
      scrollToBottom();
    }
  };

  return (
    <PageLayout title="AI 智能问答助手 · 台小湘" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">AI 智能问答助手 · 台小湘</h1>
        <p className="text-body">
          关于桂阳古戏台的历史、建筑、红色故事、湘昆非遗与研学游玩，随时向台小湘提问。
        </p>
      </div>

      <div
        ref={listRef}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 16,
          minHeight: 320,
          maxHeight: 460,
          overflow: 'auto',
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div
              style={{
                maxWidth: '78%',
                padding: '10px 14px',
                borderRadius: 12,
                background: m.role === 'user' ? '#A3232B' : '#FAF7F2',
                color: m.role === 'user' ? '#fff' : '#3B2A26',
                border: m.role === 'user' ? 'none' : '1px solid #eee',
                lineHeight: 1.8,
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
                {m.role === 'user' ? <UserOutlined /> : <RobotOutlined />} {m.role === 'user' ? '我' : '台小湘'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
              {m.matched && <Tag style={{ marginTop: 8 }} color="gold">命中知识：「{m.matched}」</Tag>}
            </div>
          </div>
        ))}
        {asking && <Spin size="small" style={{ marginLeft: 8 }} />}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ color: '#888', marginRight: 8 }}>试试问：</span>
        {QUICK_QUESTIONS.map((q) => (
          <Tag
            key={q}
            color="volcano"
            style={{ cursor: 'pointer', marginBottom: 4 }}
            onClick={() => ask(q)}
          >
            {q}
          </Tag>
        ))}
      </div>

      <Input.Search
        size="large"
        placeholder="输入你的问题，回车发送…"
        enterButton={<Button type="primary" icon={<SendOutlined />}>发送</Button>}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSearch={(v) => ask(v)}
        loading={asking}
      />
      <p style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
        台小湘基于平台戏台台账、红色故事与 FAQ 知识库回答固定问题；更复杂的问题将由团队后续接入大模型扩展。
      </p>
    </PageLayout>
  );
}
