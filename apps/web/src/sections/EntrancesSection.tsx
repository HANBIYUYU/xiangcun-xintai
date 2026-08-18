import { useNavigate } from 'react-router-dom';
import { BankOutlined, DeploymentUnitOutlined, ReadOutlined, ShoppingOutlined } from '@ant-design/icons';

const entrances = [
  {
    key: 'archive',
    icon: <BankOutlined />,
    title: '戏台数字档案',
    desc: '收录桂阳古戏台的历史沿革、建筑形制与红色故事，可检索可溯源。',
    path: '/archive',
    color: '#A3232B',
  },
  {
    key: 'hall3d',
    icon: <DeploymentUnitOutlined />,
    title: '三维古建展厅',
    desc: '三维重建还原戏台全貌，足不出户漫游桂阳古建之美。',
    path: '/3d',
    color: '#C0392B',
  },
  {
    key: 'culture',
    icon: <ReadOutlined />,
    title: '红色湘昆文化馆',
    desc: '红色戏曲、互动阅读与活动预告，感受湘昆非遗的当代回响。',
    path: '/culture',
    color: '#D4A017',
  },
  {
    key: 'mall',
    icon: <ShoppingOutlined />,
    title: '乡村文旅商城',
    desc: '乡韵文创与助农产品一站式选购，以消费助力乡村振兴。',
    path: '/mall',
    color: '#8A1B22',
  },
];

export default function EntrancesSection() {
  const navigate = useNavigate();

  return (
    <section id="entrances" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <h2 className="section-title">四大核心入口</h2>
        </div>
        <p className="section-desc">
          从档案到展厅，从文化到助农，一站式漫游桂阳古戏台的红色文旅世界
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {entrances.map((e) => (
            <div
              key={e.key}
              className="card-hover entrance-card"
              onClick={() => navigate(e.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') navigate(e.path);
              }}
              style={{ cursor: 'pointer', padding: 32 }}
            >
              <div className="entrance-icon" style={{ color: e.color }}>{e.icon}</div>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <span className="entrance-link">进入 →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
