import { useState } from 'react';
import { Input, Button, message } from 'antd';
import PageLayout from '../components/PageLayout';

export default function AIPage() {
  const [question, setQuestion] = useState('');

  const handleAsk = () => {
    if (!question.trim()) {
      message.warning('请输入你的问题');
      return;
    }
    message.info('问答功能 P12 接入问答库后上线');
    setQuestion('');
  };

  return (
    <PageLayout title="AI 智能问答助手 · 台小湘" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">AI 智能问答助手 · 台小湘</h1>
        <p className="text-body">
          关于桂阳古戏台的历史、建筑、红色故事、湘昆非遗与研学游玩，随时向台小湘提问。
        </p>
      </div>
      <div className="ai-box">
        <Input.TextArea
          rows={4}
          placeholder="例如：桂阳有哪些红色旧址戏台？湘昆有什么代表剧目？"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" size="large" onClick={handleAsk}>
          提问
        </Button>
      </div>
      <div className="placeholder-note" style={{ marginTop: 24 }}>
        问答引擎 P12 接入问答库后启用，当前为界面占位。
      </div>
    </PageLayout>
  );
}
