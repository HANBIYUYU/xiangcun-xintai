import { useEffect, useState } from 'react';
import { statsAPI } from '../api';

interface Overview {
  stages: number;
  redSites: number;
  people: number;
  revenue: number;
}

/**
 * 动态数据看板：P4 起由 /api/stats 实时统计
 * 接口未就绪或加载中时降级显示示例值
 */
export default function StatsSection() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    statsAPI.overview().then((res: any) => setData(res)).catch(() => setData(null));
  }, []);

  const stats = [
    { label: '收录戏台', value: data ? String(data.stages) : '110', suffix: ' 座', prefix: '' },
    { label: '红色旧址戏台', value: data ? String(data.redSites) : '--', suffix: ' 座', prefix: '' },
    { label: '研学接待人次', value: data ? String(data.people) : '--', suffix: ' 人', prefix: '' },
    { label: '文创销售额', value: data ? (data.revenue / 10000).toFixed(1) : '--', suffix: ' 万', prefix: '¥' },
  ];

  return (
    <section
      id="stats"
      style={{
        background: 'linear-gradient(135deg, #A3232B 0%, #C0392B 45%, #D4A017 100%)',
      }}
    >
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#fff' }}>动态数据看板</h2>
        </div>
        <p className="section-desc" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          桂阳古戏台数字化保护与红色文旅运营的最新进展
        </p>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">
                {s.prefix}{s.value}{s.suffix}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="stat-note">
          {data ? '数据由湘村新台平台实时统计' : '数据加载中…（接口未就绪时显示示例值）'}
        </p>
      </div>
    </section>
  );
}
