import PageLayout from '../components/PageLayout';

const modules = [
  { key: 'submit', title: '乡土投稿', desc: '上传戏台故事、老照片与口述史，共建乡土记忆库', phase: 'P3 实现' },
  { key: 'message', title: '建言留言', desc: '为古戏台保护与红色文旅发展建言献策', phase: 'P3 实现' },
  { key: 'quiz', title: '互动答题', desc: '红色文化与湘昆非遗知识闯关答题', phase: 'P12 实现' },
];

export default function CommunityPage() {
  return (
    <PageLayout title="乡土共创交互平台" backTo="/" backLabel="返回首页">
      <div className="page-heading">
        <h1 className="text-h1">乡土共创交互平台</h1>
        <p className="text-body">
          让每一位村民、游客与研究者都能参与桂阳古戏台的记录、保护与传播。
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}
      >
        {modules.map((m) => (
          <div key={m.key} className="card-hover" style={{ padding: 28 }}>
            <h3 className="text-h2" style={{ marginBottom: 10 }}>{m.title}</h3>
            <p className="text-body" style={{ marginBottom: 12 }}>{m.desc}</p>
            <span className="text-caption">占位 · {m.phase}</span>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
